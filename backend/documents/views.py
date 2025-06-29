from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes # <--- ADDED 'permission_classes' HERE

from .models import Document, DocumentChunk
from .serializers import DocumentSerializer, DocumentChunkSerializer

from sentence_transformers import SentenceTransformer, util
import torch
from openai import OpenAI
from django.conf import settings

# Load local MiniLM model for semantic chunk ranking (used in search)
model = SentenceTransformer("all-MiniLM-L6-v2")

# OpenRouter client for LLM interaction (chat completions)
client = OpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

# Refactored get_documents into a Class-Based View for better DRF practices
class DocumentListView(ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return documents uploaded by the currently authenticated user.
        """
        return Document.objects.filter(uploader=self.request.user).order_by('-created_at')

# Refactored get_all_documents into a Class-Based View
class AllDocumentsListView(ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        """
        Return all documents. Restricted to admin/staff users.
        """
        return Document.objects.all().order_by('-created_at')


@api_view(['POST'])
@permission_classes([IsAuthenticated]) # This decorator now should be defined
def upload_document(request):
    """
    Upload a new document.
    Processing (chunking and embeddings) is handled by a post_save signal
    in documents/signals.py, which is triggered when the Document object is saved.
    """
    title = request.data.get('title')
    description = request.data.get('description', '')
    domain = request.data.get('domain')
    author_name = request.data.get('author_name', '')
    file = request.FILES.get('file')

    if not file or not title or not domain:
        return Response({'error': 'Missing required fields: title, domain, file.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        document = Document.objects.create(
            title=title,
            description=description,
            domain=domain,
            author_name=author_name,
            file=file,
            uploader=request.user
        )
        return Response({'message': 'Document uploaded successfully. Processing will occur in the background.', 'document_id': document.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Document upload failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DocumentDetailsView(RetrieveAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get('pk')
        obj = get_object_or_404(Document, pk=pk)
        if obj.uploader != self.request.user and not self.request.user.is_staff:
            self.permission_denied(self.request, message="You do not have permission to view this document.")
        return obj


@api_view(['POST'])
@permission_classes([IsAuthenticated]) # This decorator now should be defined
def search_documents(request):
    """Search for relevant chunks in the user's documents using embeddings."""
    query = request.data.get('query')
    if not query:
        return Response({'error': 'Query not provided.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        query_embedding = model.encode(query, convert_to_tensor=True)
    except Exception as e:
        print(f"Error encoding query with local model: {e}")
        return Response({'error': 'Failed to process query for search.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    chunks_qs = DocumentChunk.objects.select_related('document').filter(document__uploader=request.user)

    scored_chunks = []
    for chunk in chunks_qs:
        if not chunk.embedding:
            continue

        try:
            chunk_tensor_embedding = torch.tensor(chunk.embedding)
        except Exception as e:
            print(f"Error converting chunk embedding to tensor for chunk ID {chunk.id}: {e}")
            continue

        try:
            similarity = util.pytorch_cos_sim(query_embedding, chunk_tensor_embedding).item()
            scored_chunks.append({
                'chunk_obj': chunk,
                'similarity': similarity
            })
        except Exception as e:
            print(f"Error calculating similarity for chunk ID {chunk.id}: {e}")
            continue

    top_scored_chunks = sorted(scored_chunks, key=lambda x: x['similarity'], reverse=True)[:5]

    relevant_chunks_data = []
    context_text = []
    for item in top_scored_chunks:
        chunk_serializer = DocumentChunkSerializer(item['chunk_obj'])
        data = chunk_serializer.data
        data['similarity'] = item['similarity']

        data['document_title'] = item['chunk_obj'].document.title
        data['document_file'] = item['chunk_obj'].document.file.url

        relevant_chunks_data.append(data)
        context_text.append(item['chunk_obj'].content)

    context_text_str = "\n\n".join(context_text)

    try:
        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes and answers based only on the provided document content."},
                {"role": "user", "content": f"Context:\n{context_text_str}\n\nQuestion: {query}"}
            ]
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling OpenAI API (OpenRouter) for chat completion: {e}")
        return Response({'error': f'Failed to get answer from AI: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({
        'query': query,
        'answer': answer,
        'relevant_chunks': relevant_chunks_data
    })

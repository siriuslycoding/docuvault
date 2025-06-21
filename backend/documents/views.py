from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt # REMOVE THIS IMPORT
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Document, DocumentChunk
from .serializers import DocumentSerializer, DocumentChunkSerializer # MODIFIED IMPORT (added DocumentChunkSerializer)

from sentence_transformers import SentenceTransformer, util
import torch
from openai import OpenAI
from django.conf import settings

# Load local MiniLM model for semantic chunk ranking
model = SentenceTransformer("all-MiniLM-L6-v2")

# OpenRouter client
client = OpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_documents(request):
    """Return documents uploaded by the currently authenticated user."""
    docs = Document.objects.filter(uploader=request.user)
    serializer = DocumentSerializer(docs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_documents(request):
    """Optional: For admin or staff use to retrieve all documents."""
    if not request.user.is_staff:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    docs = Document.objects.all()
    serializer = DocumentSerializer(docs, many=True)
    return Response(serializer.data)


# REMOVED @csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_document(request):
    """
    Upload a new document.
    Processing (chunking and embeddings) is handled by a post_save signal
    in documents/signals.py, which is triggered when the Document object is saved.
    """
    title = request.data.get('title')
    description = request.data.get('description', '')
    domain = request.data.get('domain')
    author_name = request.data.get('author_name', '') # ADDED THIS LINE
    file = request.FILES.get('file')

    if not file or not title or not domain: # ADDED check for domain as well
        return JsonResponse({'error': 'Missing required fields: title, domain, file.'}, status=400)

    # When the document is created, the post_save signal will automatically
    # handle the text extraction, chunking, and embedding generation.
    document = Document.objects.create(
        title=title,
        description=description,
        domain=domain,
        author_name=author_name, # ADDED THIS LINE
        file=file,
        uploader=request.user
    )

    return JsonResponse({'message': 'Document uploaded successfully. Processing will occur in the background.', 'document_id': document.id}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search_documents(request):
    """Search for relevant chunks in the user's documents using embeddings."""
    query = request.data.get('query')
    if not query:
        return Response({'error': 'Query not provided.'}, status=400)

    # Encode the query
    query_embedding = model.encode(query, convert_to_tensor=True)
    
    # Retrieve and calculate similarity for chunks belonging to the authenticated user's documents
    # select_related('document') optimizes the query to fetch related document data in one go
    # Order by created_at to prioritize newer chunks in case of tie-breaking or for diverse results
    chunks_qs = DocumentChunk.objects.select_related('document').filter(document__uploader=request.user)

    scored_chunks = []
    for chunk in chunks_qs:
        if not chunk.embedding:
            continue # Skip if embedding is somehow missing (shouldn't happen if processing worked)
        
        # Convert the stored list (from ArrayField) back to a torch tensor for calculation
        chunk_tensor_embedding = torch.tensor(chunk.embedding)
        
        similarity = util.pytorch_cos_sim(query_embedding, chunk_tensor_embedding).item()
        scored_chunks.append({
            'chunk_obj': chunk, # Keep the chunk object to serialize later
            'similarity': similarity
        })

    # Sort and get the top 5 relevant chunks
    top_scored_chunks = sorted(scored_chunks, key=lambda x: x['similarity'], reverse=True)[:5]
    
    # Serialize only the top chunks
    relevant_chunks_data = []
    context_text = []
    for item in top_scored_chunks:
        chunk_serializer = DocumentChunkSerializer(item['chunk_obj'])
        data = chunk_serializer.data
        data['similarity'] = item['similarity'] # Add similarity to serialized data
        
        # Add document title and file URL for context
        data['document_title'] = item['chunk_obj'].document.title
        data['document_file'] = item['chunk_obj'].document.file.url
        
        relevant_chunks_data.append(data)
        context_text.append(item['chunk_obj'].content) # Only chunk content for LLM context

    context_text_str = "\n\n".join(context_text)

    try:
        # Call the LLM (OpenRouter) with the retrieved context and query
        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct", # Or another suitable model
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes and answers based only on the provided document content."},
                {"role": "user", "content": f"Context:\n{context_text_str}\n\nQuestion: {query}"}
            ]
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({
        'query': query,
        'answer': answer,
        'relevant_chunks': relevant_chunks_data # Return serialized chunks
    })
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .utils import extract_and_store_embeddings
from .models import Document, DocumentChunk
from .serializers import DocumentSerializer

from sentence_transformers import SentenceTransformer, util
import torch
from openai import OpenAI
from django.conf import settings

# Load local MiniLM model ONLY for semantic chunk ranking
model = SentenceTransformer("all-MiniLM-L6-v2")

# OpenRouter client setup
client = OpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

@api_view(['GET'])
def get_documents(request):
    docs = Document.objects.all()
    serializer = DocumentSerializer(docs, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
def upload_document(request):
    title = request.data.get('title')
    description = request.data.get('description', '')
    domain = request.data.get('domain')
    file = request.FILES.get('file')

    if not file or not title or not domain:
        return JsonResponse({'error': 'Missing required fields.'}, status=400)

    document = Document.objects.create(
        title=title,
        description=description,
        file=file,
        domain=domain
    )

    extract_and_store_embeddings(document.id)
    return JsonResponse({'message': 'Document uploaded and embeddings stored successfully.'}, status=201)

@api_view(['POST'])
def search_documents(request):
    query = request.data.get('query')
    if not query:
        return Response({'error': 'Query not provided.'}, status=400)

    query_embedding = model.encode(query, convert_to_tensor=True)
    chunks = []

    for chunk in DocumentChunk.objects.select_related('document').all():
        if not chunk.embedding:
            continue
        similarity = util.pytorch_cos_sim(query_embedding, torch.tensor(chunk.embedding)).item()
        chunks.append({
            'document_id': chunk.document.id,
            'document_title': chunk.document.title,
            'chunk_content': chunk.content,
            'document_file': chunk.document.file.url,
            'similarity': similarity
        })

    # Top 5 chunks
    top_chunks = sorted(chunks, key=lambda x: x['similarity'], reverse=True)[:5]
    context_text = "\n\n".join([c['chunk_content'] for c in top_chunks])

    # Call Mistral on OpenRouter
    try:
        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct",  # Recommended model for instruction-following
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes and answers based only on the provided document content."},
                {"role": "user", "content": f"Context:\n{context_text}\n\nQuestion: {query}"}
            ]
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        return Response({'error': str(e)}, status=500)

    return Response({
        'query': query,
        'answer': answer,
        'relevant_chunks': top_chunks
    })

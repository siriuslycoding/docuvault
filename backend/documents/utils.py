import os
import requests
from pypdf import PdfReader
from django.conf import settings

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        print(f"Error extracting text from PDF {pdf_path}: {e}")
        return ""

# Function to chunk text
def chunk_text(text, chunk_size=500, overlap_size=50):
    chunks = []
    if not text:
        return chunks

    words = text.split()
    current_chunk = []
    for word in words:
        current_chunk.append(word)
        if len(current_chunk) >= chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = current_chunk[max(0, len(current_chunk) - overlap_size):]
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks

# Function to get embeddings from OpenRouter
def get_embeddings(texts):
    if isinstance(texts, str):
        texts = [texts]

    openrouter_api_key = settings.OPENROUTER_API_KEY
    if not openrouter_api_key:
        print("ERROR: OPENROUTER_API_KEY is not set in Django settings. Cannot get embeddings.")
        return []

    headers = {
        "Authorization": f"Bearer {openrouter_api_key}",
        "Content-Type": "application/json"
    }

    embedding_model = "BAAI/bge-small-en-v1.5" # This model is generally well-supported on OpenRouter

    data = {
        "model": embedding_model,
        "input": texts
    }

    print(f"Attempting to get embeddings from OpenRouter using model: {embedding_model}")
    print(f"OpenRouter URL: https://openrouter.ai/api/v1/embeddings")

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/embeddings",
            headers=headers,
            json=data,
            timeout=30
        )
        response.raise_for_status()
        embedding_data = response.json()
        
        embeddings = [d['embedding'] for d in embedding_data.get('data', [])]
        print(f"Successfully received {len(embeddings)} embeddings from OpenRouter.")
        return embeddings
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Request to OpenRouter embeddings failed: {e}")
        if response is not None:
            print(f"OpenRouter Response Status Code: {response.status_code}")
            print(f"OpenRouter Response Content: {response.text}") # <--- THIS LINE IS NOW UNCOMMENTED
        return []
    except Exception as e:
        print(f"ERROR: An unexpected error occurred during embedding generation: {e}")
        return []

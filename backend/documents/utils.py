import os
import requests
from pypdf import PdfReader
from django.conf import settings # Import settings to access OPENROUTER_API_KEY

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            text += page.extract_text() or "" # Use .extract_text() and handle None
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
            # Start new chunk with overlap
            current_chunk = current_chunk[max(0, len(current_chunk) - overlap_size):]
    if current_chunk: # Add any remaining words as the last chunk
        chunks.append(" ".join(current_chunk))
    return chunks

# Function to get embeddings from OpenRouter
def get_embeddings(texts):
    # Ensure texts is a list, even if a single string is passed
    if isinstance(texts, str):
        texts = [texts]

    # Get API key from Django settings
    openrouter_api_key = settings.OPENROUTER_API_KEY
    if not openrouter_api_key:
        print("OPENROUTER_API_KEY is not set in Django settings.")
        return []

    headers = {
        "Authorization": f"Bearer {openrouter_api_key}",
        "Content-Type": "application/json"
    }
    # Using a general embedding model. You might choose a specific one.
    # Check OpenRouter docs for available embedding models: https://openrouter.ai/docs
    data = {
        "model": "openai/text-embedding-ada-002", # A common and cost-effective embedding model
        "input": texts
    }

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/embeddings",
            headers=headers,
            json=data
        )
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
        embedding_data = response.json()
        # The 'data' field in the response contains a list of embedding objects
        # Each object has an 'embedding' key with the list of floats
        return [d['embedding'] for d in embedding_data.get('data', [])]
    except requests.exceptions.RequestException as e:
        print(f"Error getting embeddings from OpenRouter: {e}")
        # print(f"Response content: {response.text}") # Uncomment for more detailed error
        return []
    except Exception as e:
        print(f"An unexpected error occurred during embedding generation: {e}")
        return []
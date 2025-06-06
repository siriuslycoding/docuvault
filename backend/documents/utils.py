from .models import Document, DocumentChunk
from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfReader

# Load the embedding model once
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embeddings(text: str):
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()  # JSON serializable

def extract_text_from_pdf(file_path):
    text = ''
    with open(file_path, 'rb') as f:
        reader = PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text

def chunk_text(text, chunk_size=500, overlap=50):
    chunks = []
    words = text.split()
    i = 0
    while i < len(words):
        chunk = words[i:i + chunk_size]
        chunks.append(' '.join(chunk))
        i += chunk_size - overlap
    return chunks

def extract_and_store_embeddings(document_id):
    try:
        document = Document.objects.get(id=document_id)
        file_path = document.file.path

        # 1. Extract text
        full_text = extract_text_from_pdf(file_path)

        # 2. Chunk the text
        chunks = chunk_text(full_text)

        # 3. Store each chunk + embedding
        for chunk in chunks:
            embedding = get_embeddings(chunk)
            DocumentChunk.objects.create(
                document=document,
                content=chunk,
                embedding=embedding
            )

    except Document.DoesNotExist:
        print(f"Document with ID {document_id} not found.")

from django.core.management.base import BaseCommand
from documents.models import Document, DocumentChunk
import fitz  # PyMuPDF
from sentence_transformers import SentenceTransformer
import os

class Command(BaseCommand):
    help = "Process documents: extract, chunk, embed, and store"

    def handle(self, *args, **kwargs):
        model = SentenceTransformer("all-MiniLM-L6-v2")
        documents = Document.objects.all()

        for doc in documents:
            # Skip already chunked docs
            if DocumentChunk.objects.filter(document=doc).exists():
                self.stdout.write(f"Skipped (already processed): {doc.title}")
                continue

            # Extract PDF text
            file_path = doc.file.path
            if not os.path.exists(file_path):
                self.stdout.write(self.style.WARNING(f"File not found: {file_path}"))
                continue

            text = ""
            with fitz.open(file_path) as pdf:
                for page in pdf:
                    text += page.get_text()

            # Simple chunking (adjust as needed)
            chunk_size = 500
            overlap = 50
            chunks = []
            for i in range(0, len(text), chunk_size - overlap):
                chunk = text[i:i + chunk_size]
                if chunk.strip():
                    chunks.append(chunk.strip())

            # Generate embeddings
            embeddings = model.encode(chunks).tolist()

            # Save chunks
            for i, (chunk_text, embedding) in enumerate(zip(chunks, embeddings)):
                DocumentChunk.objects.create(
                    document=doc,
                    chunk_text=chunk_text,
                    embedding=embedding
                )

            self.stdout.write(self.style.SUCCESS(f"Processed: {doc.title} ({len(chunks)} chunks)"))

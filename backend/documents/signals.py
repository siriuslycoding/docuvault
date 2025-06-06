from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Document
from .utils import extract_text_from_pdf, chunk_text, get_embeddings
from .models import DocumentChunk

@receiver(post_save, sender=Document)
def process_document_on_upload(sender, instance, created, **kwargs):
    if not created:
        return  # Only process on new upload

    try:
        file_path = instance.file.path
        text = extract_text_from_pdf(file_path)
        chunks = chunk_text(text)
        embeddings = get_embeddings(chunks)

        for chunk, embedding in zip(chunks, embeddings):
            DocumentChunk.objects.create(
                document=instance,
                content=chunk,
                embedding=embedding
            )
    except Exception as e:
        print(f"Error processing document: {e}")

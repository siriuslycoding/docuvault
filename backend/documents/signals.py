from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Document, DocumentChunk
from .utils import extract_text_from_pdf, chunk_text, get_embeddings


@receiver(post_save, sender=Document)
def process_document_on_upload(sender, instance, created, **kwargs):
    if not created:
        return  # Process only newly created documents

    try:
        file_path = instance.file.path
        full_text = extract_text_from_pdf(file_path)

        if not full_text.strip():
            print(f"No text extracted from document ID {instance.id}")
            return

        chunks = chunk_text(full_text)

        if not chunks:
            print(f"No chunks generated for document ID {instance.id}")
            return

        embeddings = get_embeddings(chunks)

        for chunk, embedding in zip(chunks, embeddings):
            DocumentChunk.objects.create(
                document=instance,
                content=chunk,
                embedding=embedding
            )
        print(f"Processed {len(chunks)} chunks for document ID {instance.id}")

    except Exception as e:
        print(f" Error processing document ID {instance.id}: {e}")

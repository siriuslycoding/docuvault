from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Document(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='uploads/')
    domain = models.CharField(max_length=100)
    search_vector = models.TextField(null=True, blank=True)  # Use later if needed
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'documents_document'

# class DocumentEmbedding(models.Model):
#     document = models.ForeignKey("Document", on_delete=models.CASCADE)
#     chunk_text = models.TextField()
#     embedding = ArrayField(models.FloatField())

class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="chunks")
    content = models.TextField()  # <-- This is the missing field causing the error
    embedding = ArrayField(base_field=models.FloatField())
    created_at = models.DateTimeField(auto_now_add=True)

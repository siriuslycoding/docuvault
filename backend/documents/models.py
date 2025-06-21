from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from django.conf import settings
# from users.models import User # This import is not strictly needed if using settings.AUTH_USER_MODEL

# Create your models here.
class Document(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='uploads/')
    domain = models.CharField(max_length=100)
    author_name = models.CharField(max_length=255, blank=True, null=True) # ADDED THIS LINE
    search_vector = models.TextField(null=True, blank=True)

    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'documents_document'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="chunks")
    content = models.TextField()
    embedding = ArrayField(base_field=models.FloatField())
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chunk of {self.document.title[:30]}..."
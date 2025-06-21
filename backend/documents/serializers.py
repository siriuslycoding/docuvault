from rest_framework import serializers
from .models import Document, DocumentChunk
# from users.serializers import UserProfileSerializer # <<< KEEP THIS COMMENTED OUT NOW

class DocumentChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentChunk
        fields = ['id', 'content', 'created_at']

class DocumentSerializer(serializers.ModelSerializer):
    # Use PrimaryKeyRelatedField to break the circular dependency
    uploader = serializers.PrimaryKeyRelatedField(read_only=True) # <<< THIS IS THE PERMANENT CHANGE
    chunks = DocumentChunkSerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = [
            'id',
            'title',
            'description',
            'file',
            'domain',
            'author_name',
            'search_vector',
            'uploader',
            'chunks',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['uploader', 'created_at', 'updated_at']
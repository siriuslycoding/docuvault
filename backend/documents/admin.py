from django.contrib import admin
from .models import Document, DocumentChunk
#from users.models import User  # Add this

# Register your models here.
admin.site.register(Document)
admin.site.register(DocumentChunk)
#admin.site.register(User)  # Add this


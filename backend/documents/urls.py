from django.urls import path
from .views import upload_document, get_documents, search_documents

urlpatterns = [
    path('upload/', upload_document, name='upload-document'),
    path('documents/', get_documents, name='get-documents'),
    path('search/', search_documents, name='search_documents'),
]

from django.urls import path
from .views import upload_document, get_documents, search_documents, get_all_documents

urlpatterns = [
    path('upload/', upload_document, name='upload-document'),
    path('documents/', get_documents, name='get-documents'),
    path('documents/all/', get_all_documents, name='get-all-documents'), 
    path('search/', search_documents, name='search-documents'),
]

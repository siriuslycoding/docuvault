from django.urls import path
# IMPORTANT: Ensure these imports match the class names in your views.py
from .views import upload_document, search_documents, DocumentDetailsView, \
    DocumentListView, AllDocumentsListView # Corrected to import class-based views

urlpatterns = [
    # Route for listing documents (GET /api/documents/)
    path('', DocumentListView.as_view(), name='get-documents'),

    # Route for uploading documents (POST /api/documents/upload/)
    path('upload/', upload_document, name='upload-document'),

    # Route for listing all documents (GET /api/documents/all/)
    path('all/', AllDocumentsListView.as_view(), name='get-all-documents'),

    # Route for searching documents (POST /api/documents/search/)
    path('search/', search_documents, name='search-documents'),

    # Route for retrieving/updating/deleting a single document by ID (GET/PUT/PATCH/DELETE /api/documents/<id>/)
    path('<int:pk>/', DocumentDetailsView.as_view(), name='document-detail'),
]

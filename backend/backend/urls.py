from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

# Optional root health check view
def api_root(request):
    return JsonResponse({"message": "API is up and running "})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root),  # Optional health check endpoint
    path('api/users/', include('users.urls')),
    path('api/documents/', include('documents.urls')),
]

# Serve uploaded files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

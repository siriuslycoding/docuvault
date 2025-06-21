from django.urls import path
from .views import RegisterView, UserProfileView # MODIFIED IMPORT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    # TokenVerifyView, # Optional: if you need to verify tokens without refreshing
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('token/verify/', TokenVerifyView.as_view(), name='token_verify'), # Optional
    path('me/', UserProfileView.as_view(), name='user-profile'), # ADDED THIS LINE
]
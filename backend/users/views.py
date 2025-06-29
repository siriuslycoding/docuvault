from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny # ADD AllowAny
from .serializers import RegisterSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # <--- ADDED THIS LINE

class UserProfileView(generics.RetrieveAPIView):
    """
    API endpoint that allows authenticated users to view their own profile.
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Ensures that a user can only retrieve their own profile.
        """
        return self.request.user

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)  # Ensure uniqueness
    # If you have a 'full_name' field as mentioned in your project overview, add it here:
    full_name = models.CharField(max_length=255, blank=True) # Example

    USERNAME_FIELD = 'email'  # This tells Django to use email for login
    REQUIRED_FIELDS = ['username'] # Keep username as required by AbstractUser or remove it if you only want email

    def __str__(self):
        # It's usually better to return email for custom user models using email as USERNAME_FIELD
        return self.email
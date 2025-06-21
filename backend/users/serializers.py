from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from documents.serializers import DocumentSerializer # Import the full DocumentSerializer now

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    # If you intend to have a 'full_name' during registration, uncomment/add it here:
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True) # ADDED/MODIFIED

    class Meta:
        model = User
        # Important: Since USERNAME_FIELD is 'email', we can register without a visible 'username' field.
        # Django's AbstractUser still has a 'username' field, so we might need to populate it.
        # For simplicity, we'll auto-generate or use email as username for AbstractUser's internal field.
        fields = ('email', 'full_name', 'password', 'password2') # MODIFIED FIELDS
        extra_kwargs = {
            'email': {'required': True}, # Ensure email is always required
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        
        # You can add more complex password validation here if needed
        # validate_password(data['password'], user=User(**data)) # This would check against new user instance
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        full_name = validated_data.pop('full_name', '') # Pop full_name if present

        # When USERNAME_FIELD is email, AbstractUser's 'username' field still exists
        # We need to set it to something unique. Using email or a derivative is common.
        # Or, if your custom User model truly removed the username field, then this is not needed.
        # Assuming AbstractUser default username still exists:
        username = validated_data.get('email', '').split('@')[0] # Use part of email as username
        if User.objects.filter(username=username).exists():
             # If username exists, append a number
            i = 1
            while User.objects.filter(username=f"{username}{i}").exists():
                i += 1
            username = f"{username}{i}"

        user = User.objects.create_user(username=username, **validated_data)
        user.full_name = full_name # Assign full_name after creation
        user.save()
        return user

# This serializer is for fetching a user's profile, including their documents.
class UserProfileSerializer(serializers.ModelSerializer):
    # Use the imported DocumentSerializer for nested documents
    # related_name='documents' in Document model maps to this field
    documents = DocumentSerializer(many=True, read_only=True) 

    class Meta:
        model = User
        # Include full_name as it's now in your User model
        fields = ['id', 'email', 'full_name', 'documents', 'date_joined', 'last_login'] # MODIFIED FIELDS
        read_only_fields = ['id', 'email', 'documents', 'date_joined', 'last_login']
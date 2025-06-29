from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from documents.serializers import DocumentSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password], style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    full_name = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('full_name', 'email', 'password', 'password2')
        extra_kwargs = {
            'email': {'required': True},
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "User with this email already exists."})
        
        return data

    def create(self, validated_data):
        # Pop fields that are handled explicitly or are not direct model fields
        full_name = validated_data.pop('full_name')
        password = validated_data.pop('password')
        validated_data.pop('password2')
        email = validated_data.pop('email') # <--- IMPORTANT: POP EMAIL HERE

        # Split full_name into first_name and last_name
        name_parts = full_name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Ensure a unique 'username' for AbstractUser
        base_username = email.split('@')[0].replace('.', '_').replace('-', '_')
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        # Create the user using create_user method
        # Pass remaining validated_data as extra_fields if any, but ensure email/password are explicit
        user = User.objects.create_user(
            email=email, # Pass email explicitly
            password=password, # Pass password explicitly
            first_name=first_name,
            last_name=last_name,
            username=username, # Pass unique username explicitly
            **validated_data # Pass any remaining fields from validated_data
        )
        
        # Assign full_name to the custom field (if your User model has it)
        user.full_name = full_name 
        user.save() # Save the user to persist full_name and other custom fields

        return user

class UserProfileSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'first_name', 'last_name', 'documents', 'date_joined', 'last_login']
        read_only_fields = ['id', 'email', 'first_name', 'last_name', 'documents', 'date_joined', 'last_login']

    def get_full_name(self, obj):
        if obj.full_name:
            return obj.full_name
        return f"{obj.first_name} {obj.last_name}".strip()

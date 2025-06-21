from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Get the custom user model defined in settings.AUTH_USER_MODEL
User = get_user_model()

# Define an admin class for your custom User model
class CustomUserAdmin(BaseUserAdmin):
    # Add 'full_name' to the list_display for easier viewing in admin
    list_display = BaseUserAdmin.list_display + ('full_name',)
    # Add 'full_name' to the fieldsets for editing in admin
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Personal Info', {'fields': ('full_name',)}),
    )
    # Add 'full_name' to the search_fields for searching in admin
    search_fields = BaseUserAdmin.search_fields + ('full_name',)

# Unregister the default User model admin (if it was ever registered directly)
# This is a safe guard, but not strictly needed if CustomUserAdmin is registered with @admin.register(User)
# try:
#     admin.site.unregister(User)
# except admin.sites.NotRegistered:
#     pass

# Register your custom User model with your CustomUserAdmin
@admin.register(User)
class UserAdmin(CustomUserAdmin):
    pass
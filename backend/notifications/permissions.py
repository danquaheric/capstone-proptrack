from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    message = "You do not have permission to access this resource."

    def has_object_permission(self, request, view, obj):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and getattr(obj, "user_id", None) == user.id)

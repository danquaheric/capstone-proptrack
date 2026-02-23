from rest_framework.permissions import BasePermission, SAFE_METHODS


def _role(user):
    return getattr(user, "role", None)


class PropertyAccessPermission(BasePermission):
    """Role-based access:

    - LANDLORD: can CRUD only their own properties
    - TENANT: read-only on properties assigned to them
    - ADMIN: full access
    """

    message = "You do not have permission to access this property."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False

        role = _role(user)
        if role == "ADMIN":
            return True

        if request.method in SAFE_METHODS:
            return role in {"LANDLORD", "TENANT"}

        # Write actions
        return role == "LANDLORD"

    def has_object_permission(self, request, view, obj):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False

        role = _role(user)
        if role == "ADMIN":
            return True

        if role == "LANDLORD":
            return obj.owner_id == user.id

        # TENANT
        if request.method in SAFE_METHODS:
            return getattr(obj, "tenant_id", None) == user.id

        return False

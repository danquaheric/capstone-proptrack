from rest_framework.permissions import BasePermission, SAFE_METHODS


def _role(user):
    return getattr(user, "role", None)


class RentPaymentAccessPermission(BasePermission):
    """Access rules:

    - ADMIN: full access
    - LANDLORD: CRUD for payments linked to properties they own
    - TENANT: read-only for their own payments
    """

    message = "You do not have permission to access this rent record."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False

        role = _role(user)
        if role == "ADMIN":
            return True

        if request.method in SAFE_METHODS:
            return role in {"LANDLORD", "TENANT"}

        return role == "LANDLORD"

    def has_object_permission(self, request, view, obj):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False

        role = _role(user)
        if role == "ADMIN":
            return True

        if role == "LANDLORD":
            return getattr(obj.rental_property, "owner_id", None) == user.id

        if role == "TENANT":
            return request.method in SAFE_METHODS and getattr(obj, "tenant_id", None) == user.id

        return False

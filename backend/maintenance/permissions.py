from rest_framework.permissions import BasePermission, SAFE_METHODS


def _role(user):
    return getattr(user, "role", None)


class MaintenanceStatusPermission(BasePermission):
    """Allows landlords/admin to update status via POST /maintenance/:id/status/."""

    message = "You do not have permission to access this maintenance request."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        role = _role(user)
        return role in {"ADMIN", "LANDLORD"}

    def has_object_permission(self, request, view, obj):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False

        role = _role(user)
        if role == "ADMIN":
            return True

        return getattr(obj.rental_property, "owner_id", None) == user.id


class MaintenanceAccessPermission(BasePermission):
    """Access rules:

    - ADMIN: full access
    - LANDLORD: can view/update requests for properties they own
    - TENANT: can create + view own requests; cannot change status

    Note: for status updates we use a dedicated permission (see MaintenanceStatusPermission)
    because the endpoint uses POST.
    """

    message = "You do not have permission to access this maintenance request."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False

        role = _role(user)
        if role == "ADMIN":
            return True

        if request.method in SAFE_METHODS:
            return role in {"LANDLORD", "TENANT"}

        # Write operations
        if request.method == "POST":
            # POST is used for create in list endpoint (tenant only)
            return role == "TENANT"

        # PATCH/PUT/DELETE etc.
        return role == "LANDLORD"

    def has_object_permission(self, request, view, obj):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False

        role = _role(user)
        if role == "ADMIN":
            return True

        if role == "TENANT":
            if obj.tenant_id != user.id:
                return False
            # tenant: read-only except may patch title/description while OPEN (optional)
            return request.method in SAFE_METHODS

        if role == "LANDLORD":
            return getattr(obj.rental_property, "owner_id", None) == user.id

        return False

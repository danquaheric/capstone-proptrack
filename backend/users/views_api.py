from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import TenantListSerializer


class TenantListView(generics.ListAPIView):
    """List tenants for landlord/admin assignment modal.

    Query params:
      - q: optional search (username/email/first/last)

    Note: This is intentionally minimal; in a real system you'd scope visibility.
    """

    serializer_class = TenantListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = getattr(user, "role", None)

        if role not in {"LANDLORD", "ADMIN"}:
            return User.objects.none()

        qs = User.objects.filter(role="TENANT").order_by("username")
        q = (self.request.query_params.get("q") or "").strip()
        if q:
            qs = qs.filter(
                Q(username__icontains=q)
                | Q(email__icontains=q)
                | Q(first_name__icontains=q)
                | Q(last_name__icontains=q)
            )
        return qs

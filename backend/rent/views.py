from django.db.models import Q, Sum
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import RentPayment
from .permissions import RentPaymentAccessPermission
from .serializers import RentPaymentSerializer


class RentPaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = RentPaymentSerializer
    permission_classes = [RentPaymentAccessPermission]

    def get_queryset(self):
        user = self.request.user
        role = getattr(user, "role", None)

        qs = RentPayment.objects.select_related("rental_property", "tenant")

        if role == "ADMIN":
            base = qs
        elif role == "LANDLORD":
            base = qs.filter(rental_property__owner=user)
        else:  # TENANT
            base = qs.filter(tenant=user)

        # Basic filtering
        status_q = (self.request.query_params.get("status") or "").strip().upper()
        if status_q in {"PAID", "UNPAID", "OVERDUE"}:
            today = timezone.localdate()
            if status_q == "PAID":
                base = base.filter(paid_at__isnull=False)
            elif status_q == "UNPAID":
                base = base.filter(paid_at__isnull=True, due_date__gte=today)
            elif status_q == "OVERDUE":
                base = base.filter(paid_at__isnull=True, due_date__lt=today)

        prop_id = (self.request.query_params.get("property") or "").strip()
        if prop_id:
            try:
                base = base.filter(rental_property_id=int(prop_id))
            except ValueError:
                pass

        tenant_id = (self.request.query_params.get("tenant") or "").strip()
        if tenant_id:
            try:
                base = base.filter(tenant_id=int(tenant_id))
            except ValueError:
                pass

        q = (self.request.query_params.get("q") or "").strip()
        if q and role in {"LANDLORD", "ADMIN"}:
            base = base.filter(
                Q(tenant__username__icontains=q)
                | Q(tenant__email__icontains=q)
                | Q(rental_property__name__icontains=q)
                | Q(rental_property__street_address__icontains=q)
            )

        return base


class RentPaymentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RentPaymentSerializer
    permission_classes = [RentPaymentAccessPermission]
    lookup_field = "pk"

    def get_queryset(self):
        # object-level permission will enforce access
        return RentPayment.objects.select_related("rental_property", "tenant")


class TenantRentStatusView(APIView):
    """Tenant summary endpoint for dashboard widgets."""

    permission_classes = [RentPaymentAccessPermission]

    def get(self, request):
        user = request.user
        if getattr(user, "role", None) != "TENANT":
            return Response({"detail": "Only tenants can access this endpoint"}, status=status.HTTP_403_FORBIDDEN)

        qs = RentPayment.objects.filter(tenant=user)
        today = timezone.localdate()

        next_due = (
            qs.filter(paid_at__isnull=True, due_date__gte=today)
            .order_by("due_date")
            .first()
        )

        overdue_total = qs.filter(paid_at__isnull=True, due_date__lt=today).aggregate(total=Sum("amount"))["total"] or 0
        unpaid_total = qs.filter(paid_at__isnull=True, due_date__gte=today).aggregate(total=Sum("amount"))["total"] or 0

        return Response(
            {
                "next_due": RentPaymentSerializer(next_due).data if next_due else None,
                "totals": {
                    "overdue": str(overdue_total),
                    "unpaid": str(unpaid_total),
                },
            }
        )


class RentPaymentHistoryView(generics.ListAPIView):
    """Convenience endpoint for payment history.

    - TENANT: returns their own payments
    - LANDLORD/ADMIN: returns payments they can see

    Uses same filtering as list endpoint.
    """

    serializer_class = RentPaymentSerializer
    permission_classes = [RentPaymentAccessPermission]

    def get_queryset(self):
        # reuse list logic
        return RentPaymentListCreateView().get_queryset.__get__(self, RentPaymentListCreateView)()

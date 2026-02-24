from django.db.models import Q
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.service import (
    notify_maintenance_created,
    notify_maintenance_status_changed,
)

from .models import MaintenanceRequest, MaintenanceStatus
from .permissions import MaintenanceAccessPermission, MaintenanceStatusPermission
from .serializers import MaintenanceRequestSerializer


class MaintenanceListCreateView(generics.ListCreateAPIView):
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [MaintenanceAccessPermission]

    def get_queryset(self):
        user = self.request.user
        role = getattr(user, "role", None)

        qs = MaintenanceRequest.objects.select_related("rental_property", "tenant")

        if role == "ADMIN":
            base = qs
        elif role == "LANDLORD":
            base = qs.filter(rental_property__owner=user)
        else:  # TENANT
            base = qs.filter(tenant=user)

        status_q = (self.request.query_params.get("status") or "").strip().upper()
        if status_q in {"OPEN", "IN_PROGRESS", "RESOLVED"}:
            base = base.filter(status=status_q)

        q = (self.request.query_params.get("q") or "").strip()
        if q and role in {"LANDLORD", "ADMIN"}:
            base = base.filter(
                Q(tenant__username__icontains=q)
                | Q(tenant__email__icontains=q)
                | Q(rental_property__name__icontains=q)
                | Q(title__icontains=q)
                | Q(description__icontains=q)
            )

        return base

    def perform_create(self, serializer):
        # tenant creates only for themselves
        obj = serializer.save(tenant=self.request.user)

        # notify landlord
        landlord_id = getattr(obj.rental_property, "owner_id", None)
        if landlord_id:
            notify_maintenance_created(
                landlord_user_id=landlord_id,
                tenant_username=self.request.user.username,
                property_name=obj.rental_property.name,
                request_id=obj.id,
            )


class MaintenanceRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [MaintenanceAccessPermission]
    lookup_field = "pk"

    def get_queryset(self):
        return MaintenanceRequest.objects.select_related("rental_property", "tenant")

    def update(self, request, *args, **kwargs):
        # Landlord can update status; tenant cannot due to permissions.
        before = self.get_object()
        prev_status = before.status

        resp = super().update(request, *args, **kwargs)

        after = self.get_object()
        if prev_status != after.status:
            notify_maintenance_status_changed(
                tenant_user_id=after.tenant_id,
                property_name=after.rental_property.name,
                request_id=after.id,
                new_status=after.status,
            )

        return resp


class MaintenanceStatusUpdateView(APIView):
    permission_classes = [MaintenanceStatusPermission]

    def post(self, request, pk: int):
        try:
            obj = MaintenanceRequest.objects.select_related("rental_property", "tenant").get(pk=pk)
        except MaintenanceRequest.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, obj)

        new_status = (request.data.get("status") or "").strip().upper()
        if new_status not in {MaintenanceStatus.OPEN, MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.RESOLVED}:
            return Response({"status": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        prev = obj.status
        obj.status = new_status
        obj.save(update_fields=["status", "updated_at"])

        if prev != new_status:
            notify_maintenance_status_changed(
                tenant_user_id=obj.tenant_id,
                property_name=obj.rental_property.name,
                request_id=obj.id,
                new_status=obj.status,
            )

        return Response(MaintenanceRequestSerializer(obj).data)

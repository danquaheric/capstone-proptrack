from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Property, PropertyPhoto
from .permissions import PropertyAccessPermission
from .serializers import PropertyPhotoSerializer, PropertySerializer

User = get_user_model()


class PropertyListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [PropertyAccessPermission]

    def get_queryset(self):
        user = self.request.user
        role = getattr(user, "role", None)

        if role == "ADMIN":
            return Property.objects.all()

        if role == "LANDLORD":
            return Property.objects.filter(owner=user)

        # TENANT: read-only list of assigned properties
        return Property.objects.filter(tenant=user)

    def perform_create(self, serializer):
        # Landlord can create only for themselves (admin handled by permission)
        serializer.save(owner=self.request.user)


class PropertyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PropertySerializer
    permission_classes = [PropertyAccessPermission]
    lookup_field = "pk"

    def get_queryset(self):
        # Keep queryset broad; object permissions enforce access.
        return Property.objects.all()


class PropertyPhotoListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertyPhotoSerializer
    permission_classes = [PropertyAccessPermission]
    parser_classes = [MultiPartParser, FormParser]

    def get_property(self):
        pk = self.kwargs.get("pk")
        return Property.objects.get(pk=pk)

    def get_queryset(self):
        prop = self.get_property()
        self.check_object_permissions(self.request, prop)
        return PropertyPhoto.objects.filter(property=prop)

    def perform_create(self, serializer):
        prop = self.get_property()
        self.check_object_permissions(self.request, prop)
        serializer.save(property=prop)

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx


class PropertyPhotoDestroyView(generics.DestroyAPIView):
    serializer_class = PropertyPhotoSerializer
    permission_classes = [PropertyAccessPermission]
    lookup_url_kwarg = "photo_id"

    def get_queryset(self):
        # We enforce permissions against the parent property
        return PropertyPhoto.objects.select_related("property").all()

    def perform_destroy(self, instance):
        self.check_object_permissions(self.request, instance.property)
        # delete file + db record
        if instance.image:
            instance.image.delete(save=False)
        instance.delete()


class PropertyAssignTenantView(APIView):
    """Assign/unassign a tenant to a property.

    POST body: {"tenant_id": <int|null>}
    """

    permission_classes = [PropertyAccessPermission]

    def post(self, request, pk: int):
        # Ensure object-level permission check
        try:
            prop = Property.objects.get(pk=pk)
        except Property.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, prop)

        # Only landlords/admin should reach here due to permission class
        tenant_id = request.data.get("tenant_id", None)

        if tenant_id in (None, "", 0, "0"):
            prop.tenant = None
            prop.save(update_fields=["tenant", "updated_at"])
            return Response(PropertySerializer(prop).data)

        try:
            tenant_id_int = int(tenant_id)
        except (TypeError, ValueError):
            return Response({"tenant_id": "Must be an integer or null"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tenant = User.objects.get(pk=tenant_id_int)
        except User.DoesNotExist:
            return Response({"tenant_id": "Tenant not found"}, status=status.HTTP_400_BAD_REQUEST)

        if getattr(tenant, "role", None) != "TENANT":
            return Response({"tenant_id": "User is not a tenant"}, status=status.HTTP_400_BAD_REQUEST)

        prop.tenant = tenant
        prop.save(update_fields=["tenant", "updated_at"])
        return Response(PropertySerializer(prop).data)

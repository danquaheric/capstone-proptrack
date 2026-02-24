from rest_framework import serializers

from .models import MaintenanceRequest


class MaintenanceRequestSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source="rental_property.name", read_only=True)
    tenant_username = serializers.CharField(source="tenant.username", read_only=True)

    class Meta:
        model = MaintenanceRequest
        fields = [
            "id",
            "rental_property",
            "property_name",
            "tenant",
            "tenant_username",
            "category",
            "priority",
            "title",
            "description",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "tenant",
            "property_name",
            "tenant_username",
            "created_at",
            "updated_at",
        ]

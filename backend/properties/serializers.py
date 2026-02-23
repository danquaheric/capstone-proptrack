from rest_framework import serializers

from .models import Property


class PropertySerializer(serializers.ModelSerializer):
    tenant_username = serializers.CharField(source="tenant.username", read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "name",
            "street_address",
            "city",
            "state",
            "zip_code",
            "units",
            "monthly_rent",
            "status",
            "tenant",
            "tenant_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "tenant_username"]

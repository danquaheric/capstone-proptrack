from rest_framework import serializers

from .models import Property


class PropertySerializer(serializers.ModelSerializer):
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
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

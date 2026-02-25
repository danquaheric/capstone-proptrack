from rest_framework import serializers

from .models import Property, PropertyPhoto


class PropertyPhotoSerializer(serializers.ModelSerializer):
    # upload
    image = serializers.ImageField(write_only=True, required=True)

    # display
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyPhoto
        fields = ["id", "image", "image_url", "caption", "sort_order", "uploaded_at"]
        read_only_fields = ["id", "image_url", "uploaded_at"]

    def get_image_url(self, obj):
        try:
            request = self.context.get("request")
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        except Exception:
            return None


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

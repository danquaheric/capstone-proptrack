from django.utils import timezone
from rest_framework import serializers

from .models import RentPayment, RentPaymentStatus


class RentPaymentSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    property_name = serializers.CharField(source="rental_property.name", read_only=True)
    tenant_username = serializers.CharField(source="tenant.username", read_only=True)

    class Meta:
        model = RentPayment
        fields = [
            "id",
            "rental_property",
            "property_name",
            "tenant",
            "tenant_username",
            "amount",
            "due_date",
            "paid_at",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at", "property_name", "tenant_username"]

    def get_status(self, obj: RentPayment):
        # Keep logic in one place to ensure UI reflects DB truth
        if obj.paid_at:
            return RentPaymentStatus.PAID
        today = timezone.localdate()
        if obj.due_date and obj.due_date < today:
            return RentPaymentStatus.OVERDUE
        return RentPaymentStatus.UNPAID

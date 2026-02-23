from django.conf import settings
from django.db import models
from django.utils import timezone

from properties.models import Property


class RentPaymentStatus(models.TextChoices):
    PAID = "PAID", "Paid"
    UNPAID = "UNPAID", "Unpaid"
    OVERDUE = "OVERDUE", "Overdue"


class RentPayment(models.Model):
    rental_property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="rent_payments")
    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="rent_payments",
    )

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    due_date = models.DateField()
    paid_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-due_date", "-created_at"]
        indexes = [
            models.Index(fields=["tenant", "due_date"]),
            models.Index(fields=["rental_property", "due_date"]),
        ]

    def __str__(self) -> str:
        return f"RentPayment(property={self.rental_property_id}, tenant={self.tenant_id}, due={self.due_date})"

    @property
    def status(self) -> str:
        if self.paid_at:
            return RentPaymentStatus.PAID
        today = timezone.localdate()
        if self.due_date and self.due_date < today:
            return RentPaymentStatus.OVERDUE
        return RentPaymentStatus.UNPAID

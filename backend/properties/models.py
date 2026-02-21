from django.conf import settings
from django.db import models


class PropertyStatus(models.TextChoices):
    OCCUPIED = "OCCUPIED", "Occupied"
    VACANT = "VACANT", "Vacant"
    MAINTENANCE = "MAINTENANCE", "Maintenance"


class Property(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties",
    )

    name = models.CharField(max_length=255)
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=128, blank=True, default="")
    state = models.CharField(max_length=64, blank=True, default="")
    zip_code = models.CharField(max_length=32, blank=True, default="")

    units = models.PositiveIntegerField(default=0)
    monthly_rent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(
        max_length=20,
        choices=PropertyStatus.choices,
        default=PropertyStatus.VACANT,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} ({self.owner_id})"

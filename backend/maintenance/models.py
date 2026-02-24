from django.conf import settings
from django.db import models

from properties.models import Property


class MaintenanceCategory(models.TextChoices):
    PLUMBING = "PLUMBING", "Plumbing"
    ELECTRICAL = "ELECTRICAL", "Electrical"
    HVAC = "HVAC", "HVAC / Air Conditioning"
    APPLIANCES = "APPLIANCES", "Kitchen Appliances"
    STRUCTURAL = "STRUCTURAL", "Structural / Windows / Doors"
    OTHER = "OTHER", "Other"


class MaintenancePriority(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    EMERGENCY = "EMERGENCY", "Emergency"


class MaintenanceStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    RESOLVED = "RESOLVED", "Resolved"


class MaintenanceRequest(models.Model):
    rental_property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="maintenance_requests")
    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="maintenance_requests",
    )

    category = models.CharField(max_length=32, choices=MaintenanceCategory.choices, default=MaintenanceCategory.OTHER)
    priority = models.CharField(max_length=16, choices=MaintenancePriority.choices, default=MaintenancePriority.MEDIUM)
    title = models.CharField(max_length=120, blank=True, default="")
    description = models.TextField(blank=True, default="")

    status = models.CharField(max_length=20, choices=MaintenanceStatus.choices, default=MaintenanceStatus.OPEN)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["tenant", "status", "created_at"]),
            models.Index(fields=["rental_property", "status", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"MaintenanceRequest({self.id}, property={self.rental_property_id}, tenant={self.tenant_id})"

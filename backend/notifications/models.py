from django.conf import settings
from django.db import models


class NotificationType(models.TextChoices):
    MAINTENANCE_CREATED = "MAINTENANCE_CREATED", "Maintenance Created"
    MAINTENANCE_STATUS_CHANGED = "MAINTENANCE_STATUS_CHANGED", "Maintenance Status Changed"
    RENT_MARKED_PAID = "RENT_MARKED_PAID", "Rent Marked Paid"
    TENANT_ASSIGNED = "TENANT_ASSIGNED", "Tenant Assigned"


class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")

    type = models.CharField(max_length=64, choices=NotificationType.choices)
    title = models.CharField(max_length=140)
    message = models.TextField(blank=True, default="")

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_read", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"Notification({self.user_id}, {self.type}, read={self.is_read})"


class NotificationPreference(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notification_preferences")

    mute_all = models.BooleanField(default=False)

    # In-app toggles (MVP)
    rent_updates = models.BooleanField(default=True)
    maintenance_updates = models.BooleanField(default=True)
    tenant_updates = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"NotificationPreference({self.user_id}, mute={self.mute_all})"

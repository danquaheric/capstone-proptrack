from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    LANDLORD = "LANDLORD", "Landlord"
    TENANT = "TENANT", "Tenant"
    ADMIN = "ADMIN", "Admin"


class User(AbstractUser):
    """Custom user with role.

    Week 1 scope:
    - default role is TENANT (per Victor)
    - admins can be created via createsuperuser or management commands later
    """

    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.TENANT,
    )

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"

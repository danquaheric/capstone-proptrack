from typing import Optional

from django.contrib.auth import get_user_model

from .models import Notification, NotificationPreference, NotificationType

User = get_user_model()


def _pref_allows(user_id: int, kind: str) -> bool:
    pref = NotificationPreference.objects.filter(user_id=user_id).first()
    if not pref:
        return True
    if pref.mute_all:
        return False

    if kind == "rent":
        return pref.rent_updates
    if kind == "maintenance":
        return pref.maintenance_updates
    if kind == "tenant":
        return pref.tenant_updates

    return True


def notify(user_id: int, *, type: str, title: str, message: str = "", kind: Optional[str] = None) -> Optional[Notification]:
    # kind is used for preference toggles
    if kind and not _pref_allows(user_id, kind):
        return None

    return Notification.objects.create(
        user_id=user_id,
        type=type,
        title=title,
        message=message or "",
    )


def notify_maintenance_created(*, landlord_user_id: int, tenant_username: str, property_name: str, request_id: int):
    return notify(
        landlord_user_id,
        type=NotificationType.MAINTENANCE_CREATED,
        kind="maintenance",
        title="New maintenance request",
        message=f"{tenant_username} created a maintenance request for {property_name} (#{request_id}).",
    )


def notify_maintenance_status_changed(*, tenant_user_id: int, property_name: str, request_id: int, new_status: str):
    return notify(
        tenant_user_id,
        type=NotificationType.MAINTENANCE_STATUS_CHANGED,
        kind="maintenance",
        title="Maintenance status updated",
        message=f"Your maintenance request for {property_name} (#{request_id}) is now {new_status}.",
    )

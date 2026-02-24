from django.urls import path

from .views import (
    NotificationListView,
    NotificationMarkReadView,
    NotificationPreferenceView,
    NotificationReadAllView,
)

urlpatterns = [
    path("notifications/", NotificationListView.as_view(), name="notifications-list"),
    path("notifications/<int:pk>/read/", NotificationMarkReadView.as_view(), name="notifications-read"),
    path("notifications/read-all/", NotificationReadAllView.as_view(), name="notifications-read-all"),
    path("notification-preferences/", NotificationPreferenceView.as_view(), name="notification-preferences"),
]

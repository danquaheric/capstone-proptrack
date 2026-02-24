from django.urls import path

from .views import (
    MaintenanceListCreateView,
    MaintenanceRetrieveUpdateView,
    MaintenanceStatusUpdateView,
)

urlpatterns = [
    path("maintenance/", MaintenanceListCreateView.as_view(), name="maintenance-list-create"),
    path("maintenance/<int:pk>/", MaintenanceRetrieveUpdateView.as_view(), name="maintenance-detail"),
    path("maintenance/<int:pk>/status/", MaintenanceStatusUpdateView.as_view(), name="maintenance-status"),
]

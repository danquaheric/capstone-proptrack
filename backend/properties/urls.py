from django.urls import path

from .views import (
    PropertyAssignTenantView,
    PropertyListCreateView,
    PropertyRetrieveUpdateDestroyView,
)

urlpatterns = [
    path("properties/", PropertyListCreateView.as_view(), name="properties-list-create"),
    path(
        "properties/<int:pk>/",
        PropertyRetrieveUpdateDestroyView.as_view(),
        name="properties-detail",
    ),
    path(
        "properties/<int:pk>/assign-tenant/",
        PropertyAssignTenantView.as_view(),
        name="properties-assign-tenant",
    ),
]

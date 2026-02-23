from django.urls import path

from .views_api import TenantListView

urlpatterns = [
    path("users/tenants/", TenantListView.as_view(), name="tenant-list"),
]

from django.urls import path

from .views import (
    RentPaymentHistoryView,
    RentPaymentListCreateView,
    RentPaymentRetrieveUpdateDestroyView,
    TenantRentStatusView,
)

urlpatterns = [
    path("rent-payments/", RentPaymentListCreateView.as_view(), name="rentpayment-list-create"),
    path(
        "rent-payments/<int:pk>/",
        RentPaymentRetrieveUpdateDestroyView.as_view(),
        name="rentpayment-detail",
    ),
    path("rent-payments/history/", RentPaymentHistoryView.as_view(), name="rentpayment-history"),
    path("tenants/me/rent-status/", TenantRentStatusView.as_view(), name="tenant-rent-status"),
]

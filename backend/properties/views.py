from rest_framework import generics

from .models import Property
from .permissions import IsLandlord
from .serializers import PropertySerializer


class PropertyListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsLandlord]

    def get_queryset(self):
        # Landlord can see only their properties
        return Property.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

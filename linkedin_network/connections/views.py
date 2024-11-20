from rest_framework.exceptions import AuthenticationFailed
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import CustomPageNumberPagination
from django.db.models.functions import Lower
from .models import Connection
from .serializers import ConnectionSerializer, CountrySerializer
from .filters import ConnectionFilter
from rest_framework.response import Response
import jwt

class LocationMetadataView(APIView):
    def get(self, request):
        # Check for authentication token
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Query unique locations
        locations = Connection.objects.filter(
                country__isnull=False, 
                country__gt='',
            ).exclude(
                country__in=["Unknown", "Not Found"]
            ).values_list('country', flat=True).distinct()

        # Prepare the data
        metadata = {
            "locations": list(locations),
        }

        # Serialize the data
        serializer = CountrySerializer(metadata)

        # Return the serialized data
        return Response(serializer.data)

class ConnectionListView(ListAPIView):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
    pagination_class = CustomPageNumberPagination
    filter_backends = [DjangoFilterBackend]  # Enable filtering
    filterset_class = ConnectionFilter

    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Get the filtered queryset
        filtered_connections = self.filter_queryset(self.get_queryset())

        # Paginate the filtered queryset
        page = self.paginate_queryset(filtered_connections)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # If not paginated, return all filtered connections
        serializer = self.get_serializer(filtered_connections, many=True)
        return Response(serializer.data)

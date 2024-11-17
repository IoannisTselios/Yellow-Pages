from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.db.models.functions import Lower
from .models import Role
from .serializers import PositionSerializer
import jwt

class PositionMetadataView(APIView):
    def get(self, request):
        # Check for authentication token
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Query unique positions
        positions = Role.objects.annotate(lower_position=Lower('position')) \
            .filter(lower_position__isnull=False, lower_position__gt='') \
            .values_list('lower_position', flat=True).distinct()

        # Prepare the data
        metadata = {
            "positions": list(positions),
        }

        # Serialize the data
        serializer = PositionSerializer(metadata)

        # Return the serialized data
        return Response(serializer.data)

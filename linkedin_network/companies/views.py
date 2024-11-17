from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.db.models.functions import Lower
from .models import Company
from .serializers import CompanyMetadataSerializer
import jwt

class CompanyMetadataView(APIView):
    def get(self, request):
        # Check for authentication token
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Query unique industries and headquarters
        industries = Company.objects.annotate(lower_industry=Lower('industry')) \
            .filter(lower_industry__isnull=False, lower_industry__gt='') \
            .values_list('lower_industry', flat=True).distinct()
        headquarters = Company.objects.annotate(lower_headquarters=Lower('headquarters')) \
            .filter(lower_headquarters__isnull=False, lower_headquarters__gt='') \
            .values_list('lower_headquarters', flat=True).distinct()

        # Prepare the data
        metadata = {
            "industries": list(industries),
            "headquarters": list(headquarters),
        }

        # Serialize the data
        serializer = CompanyMetadataSerializer(metadata)

        # Return the serialized data
        return Response(serializer.data)

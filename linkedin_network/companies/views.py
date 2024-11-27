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
            .values_list('lower_industry', flat=True).distinct().order_by('industry')
        headquarter_country = Company.objects.filter(
                headquarter_country__isnull=False, 
                headquarter_country__gt='',
            ).exclude(
                headquarter_country__in=["Unknown", "Not Found"]
            ).values_list('headquarter_country', flat=True).distinct().order_by('headquarter_country')

        # Prepare the data
        metadata = {
            "industries": list(industries),
            "headquarters": list(headquarter_country),
        }

        # Serialize the data
        serializer = CompanyMetadataSerializer(metadata)

        # Return the serialized data
        return Response(serializer.data)

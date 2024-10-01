from rest_framework.generics import ListAPIView
from .models import Connection
from .serializers import ConnectionSerializer
from  linkedin_network.jwt_auth import jwt_required
from django.utils.decorators import method_decorator


@method_decorator(jwt_required, name='dispatch')
class ConnectionListView(ListAPIView):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
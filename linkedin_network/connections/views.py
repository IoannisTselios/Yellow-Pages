from rest_framework.exceptions import AuthenticationFailed
from rest_framework.generics import ListAPIView
from .models import Connection
from .serializers import ConnectionSerializer
from  linkedin_network.jwt_auth import jwt_required
from django.utils.decorators import method_decorator
from rest_framework.response import Response
import jwt


class ConnectionListView(ListAPIView):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer

    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        
        connections = self.get_queryset()
        serializer = self.get_serializer(connections, many=True)
        return Response(serializer.data)
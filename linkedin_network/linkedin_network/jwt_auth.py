import jwt
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from functools import wraps

def jwt_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        token = request.COOKIES.get('jwt')  # Check for the JWT token in cookies (or headers)

        if not token:
            raise AuthenticationFailed('Authentication credentials were not provided.')

        try:
            # Decode the token and validate it
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token.')

        # Attach user ID from the token to the request object
        request.user_id = payload['id']

        return view_func(request, *args, **kwargs)

    return wrapped_view

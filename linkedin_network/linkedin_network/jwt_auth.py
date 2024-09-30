import jwt
from rest_framework.response import Response
from functools import wraps
from django.http import JsonResponse  # Django's HttpResponse for JSON responses

def jwt_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        token = request.COOKIES.get('jwt')  # Check for the JWT token in cookies (or headers)

        if not token:
            return JsonResponse({'error': 'Authentication failed. Token was not provided.'}, status=401)

        try:
            # Decode the token and validate it
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Authentication failed. Token has expired.'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Authentication failed. Invalid token.'}, status=401)

        # Attach user ID from the token to the request object
        request.user_id = payload['id']

        return view_func(request, *args, **kwargs)

    return wrapped_view


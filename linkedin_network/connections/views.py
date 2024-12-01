from rest_framework.exceptions import AuthenticationFailed
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import CustomPageNumberPagination
from django.db.models.functions import Lower
from django.http import JsonResponse
from django.db import connection
from .models import Connection
from .serializers import ConnectionSerializer, CountrySerializer
from .filters import ConnectionFilter
from .sql_samples import instructions, explanation1, examples_and_answers
from rest_framework.response import Response
from rest_framework import status
import jwt
from openai import OpenAI
import json
import os


## Set OpenAI API key
openai_api_key = os.getenv('OPEN_AI', 'my-key')

class GenerateQueryView(APIView):
    """
    API View to handle SQL query generation and execution based on user prompts.
    """
    serializer_class = ConnectionSerializer
    pagination_class = CustomPageNumberPagination

    def post(self, request):
        try:
            # Check for authentication token
            token = request.COOKIES.get('jwt')
            if not token:
                raise AuthenticationFailed('Unauthenticated!')

            try:
                payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            except jwt.ExpiredSignatureError:
                raise AuthenticationFailed('Unauthenticated!')
            
            client = OpenAI(api_key=openai_api_key)
            # Parse the request body for the user prompt
            user_prompt = request.data.get("prompt", "")
            if not user_prompt:
                return Response({"error": "Prompt is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Build the message list dynamically
            messages = [
                {"role": "system", "content": "You are a SQL query generator."},
                {"role": "user", "content": instructions},
                {"role": "user", "content": explanation1},
                {"role": "assistant", "content": "Ok, understood. Ready to generate the SQL query now. Tell me what to do."},
            ]

            for item in examples_and_answers:
                messages.append({"role": "user", "content": item["example"]})
                messages.append({"role": "assistant", "content": item["answer"]})

            messages.append({"role": "user", "content": user_prompt})

            # Generate the SQL query using OpenAI
            response = client.chat.completions.create(
                model="gpt-4o-mini",  # Use "gpt-3.5-turbo" for a cost-effective option
                messages = messages,
                max_tokens=500,  # Adjust based on the expected length of the SQL query
                temperature=0,   # Set to 0 for deterministic output
            )

            sql_query = response.choices[0].message.content.strip()
            if sql_query.startswith("```") and sql_query.endswith("```"):
                sql_query = sql_query[sql_query.find('\n')+1:-3].strip()
            sql_query = sql_query.replace("\\\\", "\\")
            

            # Execute the generated SQL query
            with connection.cursor() as cursor:
                print(f"Generated Query (before execution): {sql_query}")
                cursor.execute(sql_query)
                urls = [row[0] for row in cursor.fetchall()]

              # Step 5: Query the `Connection` model using the IDs
            queryset = Connection.objects.filter(url__in=urls)

            # Step 6: Serialize and paginate the results
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(queryset, request, view=self)

            serializer = self.serializer_class(page, many=True)
            if page is not None:
                return paginator.get_paginated_response(serializer.data)

            # If not paginated, return all results
            serialized_data = serializer.data
            return Response(serialized_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        countries = Connection.objects.filter(
                country__isnull=False, 
                country__gt='',
            ).exclude(
                country__in=["Unknown", "Not Found"]
            ).values_list('country', flat=True).distinct().order_by('country')

        # Prepare the data
        metadata = {
            "locations": list(countries),
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

from rest_framework import serializers
from django.db.models.functions import Lower
from .models import Role, Function

class FunctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Function
        fields = ['function', 'months_in_function', 'is_current']

class RoleSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source='company.name')
    location = serializers.CharField(source='company.headquarters') 

    class Meta:
        model = Role
        fields = ['company', 'position', 'description', 'start_date', 'end_date', 'location', 'main_role']


class PositionSerializer(serializers.Serializer):
    positions = serializers.ListField(
        child=serializers.CharField(),
        label="Positions"
    )

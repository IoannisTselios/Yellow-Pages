from rest_framework import serializers
from django.db.models.functions import Lower
from .models import Role, Function

class FunctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Function
        fields = ['function', 'months_in_function', 'is_current']

class RoleSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source='company.name')
    industry = serializers.CharField(source='company.industry')
    location = serializers.CharField(source='company.headquarters') 
    company_description = serializers.CharField(source='company.description') 
    company_size = serializers.CharField(source='company.employee_count') 
    year_founded = serializers.CharField(source='company.year_founded') 

    class Meta:
        model = Role
        fields = ['company', 'position', 'industry', 'company_description', 'company_size', 'year_founded', 'description', 'start_date', 'end_date', 'location', 'main_role']


class PositionSerializer(serializers.Serializer):
    positions = serializers.ListField(
        child=serializers.CharField(),
        label="Positions"
    )

from rest_framework import serializers
from .models import Role

class RoleSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source='company.name')
    location = serializers.CharField(source='company.headquarters') 

    class Meta:
        model = Role
        fields = ['company', 'position', 'start_date', 'end_date', 'location', 'main_role']
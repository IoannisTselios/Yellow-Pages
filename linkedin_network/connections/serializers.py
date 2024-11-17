from rest_framework import serializers
from .models import Connection
from roles.serializers import RoleSerializer

class LocationSerializer(serializers.Serializer):
    locations = serializers.ListField(
        child=serializers.CharField(),
        label="Locations"
    )

class ConnectionSerializer(serializers.ModelSerializer):
    main_role = serializers.SerializerMethodField()
    other_roles = serializers.SerializerMethodField()
    past_roles = serializers.SerializerMethodField()
    connected_with = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = ['first_name', 'last_name', 'location', 'connection_strength', 'url', 'bio', 'summary', 'connected_with', 'main_role', 'other_roles', 'past_roles']

    def get_main_role(self, obj):
        # Main role: main_role=True
        main_role = obj.role_set.filter(main_role=True).first()
        if main_role:
            return RoleSerializer(main_role).data
        return None

    def get_other_roles(self, obj):
        # Other roles: Not main_role and no end_date (current ongoing roles)
        other_roles = obj.role_set.filter(main_role=False, end_date__isnull=True)
        return RoleSerializer(other_roles, many=True).data

    def get_past_roles(self, obj):
        # Past roles: Not main_role and has an end_date (past roles)
        past_roles = obj.role_set.filter(main_role=False, end_date__isnull=False)
        return RoleSerializer(past_roles, many=True).data

    def get_connected_with(self, obj):
        return [conn.first_name for conn in obj.connections.all()]
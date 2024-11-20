from rest_framework import serializers

class CompanyMetadataSerializer(serializers.Serializer):
    industries = serializers.ListField(
        child=serializers.CharField(),
        label="Industries"
    )
    headquarters = serializers.ListField(
        child=serializers.CharField(),
        label="Headquarter_Country"
    )

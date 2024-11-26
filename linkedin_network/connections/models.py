from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings 

class Connection(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    bio = models.TextField(null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    url = models.URLField(primary_key=True, max_length=200)
    location = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True)
    # many-to-many relation to app users
    connections = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='connections', through='UserConnection', blank=False)
    connection_strength = models.FloatField()

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    

class UserConnection(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    connection = models.ForeignKey(Connection, to_field='url', on_delete=models.CASCADE, db_column='connection_url', related_name='user_connections')
    connected_on = models.DateTimeField()
    
    class Meta:
        unique_together = ('user', 'connection')

    def __str__(self):
        return f'{self.user.username} linked to {self.connection.first_name} {self.connection.last_name}'
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User 

from .utils import strength_metric_calculation

class Connection(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    bio = models.TextField(null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    url = models.URLField(max_length=200)
    location = models.CharField(max_length=100)
    # many-to-many relation to app users
    connections = models.ManyToManyField(User, related_name='connections', through='UserConnection', blank=False)

    @property
    def connection_strength(self):
        return strength_metric_calculation(self)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    

class UserConnection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False) 
    connection = models.ForeignKey(Connection, on_delete=models.CASCADE)
    connected_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'connection')  # a user cannot be linked to the same connection multiple times

    def __str__(self):
        return f'{self.user.username} linked to {self.connection.first_name} {self.connection.last_name}'
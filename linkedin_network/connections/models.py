from django.db import models
from companies.models import Company 

from .utils import strength_metric_calculation

class Connection(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    bio = models.TextField(null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    url = models.URLField(max_length=200)
    location = models.CharField(max_length=100)

    @property
    def connection_strength(self):
        return strength_metric_calculation(self)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
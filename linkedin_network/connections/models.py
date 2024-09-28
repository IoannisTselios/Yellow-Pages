from django.db import models
from companies.models import Company 

class Connection(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    url = models.URLField(max_length=200)
    current_company = models.ForeignKey(Company, on_delete=models.SET_NULL, blank=True, null=True)  # ForeignKey to Company model
    current_position = models.CharField(max_length=100)
    current_location = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.current_company}'
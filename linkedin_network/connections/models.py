from django.db import models

class Connection(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    url = models.URLField(max_length=200)
    current_company = models.CharField(max_length=100)
    current_position = models.CharField(max_length=100)
    current_location = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.current_company}'
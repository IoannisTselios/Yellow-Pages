from django.db import models
from connections.models import Connection
from companies.models import Company


class Role(models.Model):
    connection = models.ForeignKey(Connection, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    position = models.CharField(max_length=100)
    start_date = models.DateTimeField()  # Store the start date as a DateTimeField
    end_date = models.DateTimeField(blank=True, null=True)  # Allow null for ongoing roles
    main_role = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.connection.first_name} {self.connection.last_name}: {self.position}'
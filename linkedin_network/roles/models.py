from django.db import models
from connections.models import Connection
from companies.models import Company

from django.core.exceptions import ValidationError


class Role(models.Model):
    connection = models.ForeignKey(Connection, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    position = models.CharField(max_length=100)
    start_date = models.DateField()  # Store the start date as a DateTimeField
    end_date = models.DateField(blank=True, null=True)  # Allow null for ongoing roles
    main_role = models.BooleanField(default=False)

    def clean(self):
        # Ensure start_date is the first of the month
        if self.start_date.day != 1:
            raise ValidationError("Start date must be the first day of the month.")
        
        # Ensure end_date is the first of the month, if provided
        if self.end_date and self.end_date.day != 1:
            raise ValidationError("End date must be the first day of the month.")

    def __str__(self):
        return f'{self.connection.first_name} {self.connection.last_name}: {self.position}'
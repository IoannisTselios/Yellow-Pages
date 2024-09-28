from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=100)
    website = models.URLField(max_length=200)
    linkedin_link = models.URLField(max_length=200, verbose_name="LinkedIn Link")
    company_type = models.CharField(max_length=50)
    industry = models.CharField(max_length=100)
    description = models.TextField()
    employee_count = models.IntegerField()
    year_founded = models.IntegerField()

    # to be scraped
    investment_stage = models.CharField(max_length=50)
    funding =  models.IntegerField()


    def __str__(self):
         return f'{self.name} - {self.current_company}'


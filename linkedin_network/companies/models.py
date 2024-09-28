from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=100)
    website = models.URLField(max_length=200)
    linkedin_link = models.URLField(max_length=200, verbose_name="LinkedIn Link")
    company_type = models.CharField(max_length=50)
    industry = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    employee_count = models.IntegerField()
    year_founded = models.IntegerField()

    # to be scraped
    headquarters = models.CharField(max_length=50, blank=True, null=True) # this should not be nullanble 
    investment_stage = models.CharField(max_length=50, blank=True, null=True)
    funding =  models.IntegerField(blank=True, null=True)


    def __str__(self):
         return f'{self.name}'


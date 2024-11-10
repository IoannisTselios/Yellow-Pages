from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=100)
    website = models.URLField(max_length=200)
    linkedin_link = models.URLField(max_length=200, verbose_name="LinkedIn Link", blank=True, null=True)
    linkedin_sales_link = models.URLField(max_length=200, verbose_name="LinkedIn Sales Navigator Link", unique=True)
    company_type = models.CharField(max_length=50)
    industry = models.CharField(max_length=100)
    specialties = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    employee_count = models.IntegerField(blank=True, null=True)
    year_founded = models.IntegerField(blank=True, null=True)

    # to be scraped
    headquarters = models.CharField(max_length=150, blank=True, null=True) # this should not be nullanble 
    investment_stage = models.CharField(max_length=50, blank=True, null=True)
    funding =  models.IntegerField(blank=True, null=True)


    def __str__(self):
         return f'{self.name}'


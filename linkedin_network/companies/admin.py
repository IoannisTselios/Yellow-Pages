from django.contrib import admin
from .models import Company


class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'company_type', 'industry', 'employee_count', 'year_founded')
    search_fields = ('name', 'industry', 'company_type')
    list_filter = ('company_type', 'industry', 'year_founded')

admin.site.register(Company, CompanyAdmin)

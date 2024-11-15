from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django import forms
from .models import Company
from .utils import save_companies_from_dataframe
from django.template.response import TemplateResponse
import pandas as pd


class CSVUploadForm(forms.Form):
    csv_file = forms.FileField()

class CompanyAdmin(admin.ModelAdmin):
    change_list_template = "admin/enriched_change_list.html"  # Custom template

    list_display = ('name', 'company_type', 'industry', 'employee_count', 'year_founded')
    search_fields = ('name', 'industry', 'company_type')
    list_filter = ('company_type', 'industry', 'year_founded')

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('upload-csv-companies/', self.admin_site.admin_view(self.upload_csv), name="upload-csv-companies"),
        ]
        return custom_urls + urls
    
    def upload_csv(self, request):
        if request.method == "POST":
            form = CSVUploadForm(request.POST, request.FILES)
            if form.is_valid():
                csv_file = request.FILES["csv_file"]
                
                # Try to load the CSV into a DataFrame
                try:
                    df = pd.read_csv(csv_file)
                    save_companies_from_dataframe(df)
                except Exception as e:
                    self.message_user(request, f"Failed to load CSV: {e}", level="error")
                    return redirect("..")
                
                self.message_user(request, "CSV uploaded successfully!")
                return redirect("..")
        else:
            form = CSVUploadForm()
        
        context = self.admin_site.each_context(request)
        context["form"] = form
        return render(request, "admin/csv_upload_form.html", context)


admin.site.register(Company, CompanyAdmin)

from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django import forms
from .models import Role
from .utils import save_roles_from_dataframe
import pandas as pd

class CSVUploadForm(forms.Form):
    csv_file = forms.FileField()

class RoleAdmin(admin.ModelAdmin):
    change_list_template = "admin/enriched_change_list.html"  # Custom template

    list_display = ('connection', 'position', 'company', 'start_date', 'end_date', 'main_role')
    search_fields = ('connection__first_name', 'connection__last_name', 'position', 'company__name')
    list_filter = ('main_role', 'company')


    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('upload-csv-roles/', self.admin_site.admin_view(self.upload_csv), name="upload-csv-roles"),
        ]
        return custom_urls + urls
    
    def upload_csv(self, request):
        if request.method == "POST":
            form = CSVUploadForm(request.POST, request.FILES)
            if form.is_valid():
                csv_file = request.FILES["csv_file"]
                
                # Try to load the CSV into a DataFrame
                try:
                    # chunks = []
                    # for chunk in pd.read_csv(csv_file, engine='python', chunksize=10000):
                    #     chunks.append(chunk)
                    # # Combine all chunks into a single DataFrame
                    # df = pd.concat(chunks, ignore_index=True)
                    df = pd.read_csv(csv_file)
                    save_roles_from_dataframe(df)
                    print('ok')

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


admin.site.register(Role, RoleAdmin)
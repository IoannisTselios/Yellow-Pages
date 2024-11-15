from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django import forms
from .models import Connection, UserConnection
from .utils import save_connections_from_dataframe
from roles.models import Role 
import pandas as pd


class CSVUploadForm(forms.Form):
    csv_file = forms.FileField()

class UserConnectionInline(admin.TabularInline):
    model = UserConnection  
    extra = 1  # number of empty forms to display
    # autocomplete_fields = ['user']  # Search for users
    # readonly_fields = ['connected_on']
    fk_name = 'connection'  # Explicitly set the foreign key field

class ConnectionAdmin(admin.ModelAdmin):
    change_list_template = "admin/enriched_change_list.html"  # Custom template

    list_display = ('first_name', 'last_name', 'location', 'get_current_position', 'get_current_company', 'connection_strength', 'url')
    search_fields = ('first_name', 'last_name', 'location')
    inlines = [UserConnectionInline]

    def get_current_position(self, obj):
        # Fetch the main role for this connection
        role = Role.objects.filter(connection=obj, main_role=True).first()
        if not role:  # Fallback
            return 'No Role Assigned'
        return role.position if role else 'No Role Assigned'

    get_current_position.short_description = 'Main Position'  # Column name in admin

    def get_current_company(self, obj):
        # Fetch main role for this connection
        role = Role.objects.filter(connection=obj, main_role=True).first()
        if not role:  # Fallback 
            return 'No Company Assigned'
        return role.company.name if role else 'No Company Assigned'

    get_current_company.short_description = 'Main Company'  # Column name in admin

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('upload-csv-connections/', self.admin_site.admin_view(self.upload_csv), name="upload-csv-connections"),
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
                    save_connections_from_dataframe(df)
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

admin.site.register(Connection, ConnectionAdmin)

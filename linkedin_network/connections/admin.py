from django.contrib import admin
from .models import Connection

class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'current_company', 'current_position', 'current_location')
    search_fields = ('first_name', 'last_name', 'current_company', 'current_position', 'current_location')
    list_filter = ('current_company', 'current_location')

admin.site.register(Connection, ConnectionAdmin)

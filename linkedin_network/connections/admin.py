from django.contrib import admin
from .models import Connection

from django.utils.html import format_html
from django.urls import reverse

class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'current_company', 'current_position', 'current_location')
    search_fields = ('first_name', 'last_name', 'current_company', 'current_position', 'current_location')
    list_filter = ('current_company', 'current_location')


    def current_company_link(self, obj):
        if obj.current_company:
            url = reverse('admin:companies_company_change', args=[obj.current_company.id])
            return format_html('<a href="{}">{}</a>', url, obj.current_company.name)
        return '-'
    
    current_company_link.short_description = 'Current Company'
    current_company_link.admin_order_field = 'current_company'

admin.site.register(Connection, ConnectionAdmin)

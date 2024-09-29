from django.contrib import admin
from .models import Role

class RoleAdmin(admin.ModelAdmin):
    list_display = ('connection', 'position', 'company', 'start_date', 'end_date', 'main_role')
    search_fields = ('connection__first_name', 'connection__last_name', 'position', 'company__name')
    list_filter = ('main_role', 'company')

admin.site.register(Role, RoleAdmin)
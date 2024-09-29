from django.contrib import admin
from .models import Connection, UserConnection
from roles.models import Role 


class UserConnectionInline(admin.TabularInline):
    model = UserConnection  
    extra = 1  # number of empty forms to display
    autocomplete_fields = ['user']  # search for users

class ConnectionAdmin(admin.ModelAdmin):
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

admin.site.register(Connection, ConnectionAdmin)

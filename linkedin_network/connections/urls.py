from django.urls import path
from .views import ConnectionListView, LocationMetadataView

urlpatterns = [
    path('get_locations/', LocationMetadataView.as_view(), name='locations'),
    path('get_connection_list/', ConnectionListView.as_view(), name='connections'),
]

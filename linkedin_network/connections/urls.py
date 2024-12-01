from django.urls import path
from .views import ConnectionListView, LocationMetadataView, GenerateQueryView

urlpatterns = [
    path('get_locations/', LocationMetadataView.as_view(), name='locations'),
    path('get_connection_list/', ConnectionListView.as_view(), name='connections'),
    path('generate_query/', GenerateQueryView.as_view(), name='generate_query'),
]

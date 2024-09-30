from django.urls import path
from .views import ConnectionListView

urlpatterns = [
    path('get_connection_list/', ConnectionListView.as_view(), name='connections'),
]

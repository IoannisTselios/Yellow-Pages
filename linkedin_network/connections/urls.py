from django.urls import path
from .views import ConnectionListView

urlpatterns = [
    path('connections/', ConnectionListView.as_view(), name='connections'),
]

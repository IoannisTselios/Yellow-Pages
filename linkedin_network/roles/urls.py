from django.urls import path
from .views import PositionMetadataView

urlpatterns = [
    path('get_positions/', PositionMetadataView.as_view(), name='positions'),
]
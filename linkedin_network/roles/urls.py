from django.urls import path
from .views import PositionMetadataView, FunctionMetadataView

urlpatterns = [
    path('get_positions/', PositionMetadataView.as_view(), name='positions'),
    path('get_functions/', FunctionMetadataView.as_view(), name='functions'),
]
from django.urls import path
from .views import CompanyMetadataView

urlpatterns = [
    path('get_company_metadata/', CompanyMetadataView.as_view(), name='company-metadata'),
]

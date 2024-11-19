from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
import math

class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'page_size'  # Query parameter for page size
    max_page_size = 1000  #  maximum limit to prevent abuse

    def get_paginated_response(self, data):
        total_pages = math.ceil(self.page.paginator.count / self.page.paginator.per_page)
        return Response({
            'count': self.page.paginator.count,
            'total_pages': total_pages,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })
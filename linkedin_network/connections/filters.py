from django_filters import rest_framework as filters
from django.db.models import Q
from .models import Connection
import re

class ConnectionFilter(filters.FilterSet):
    # filtering first name - exact match
    first_name = filters.CharFilter(method='filter_by_first_name', lookup_expr='iexact')
    # filtering last name - exact match
    last_name = filters.CharFilter(method='filter_by_last_name', lookup_expr='iexact')

    # filtering main company - exact match
    main_company = filters.CharFilter(method='filter_by_main_company', lookup_expr='iexact')
    # filtering past company - exact match
    past_company = filters.CharFilter(method='filter_by_past_company', lookup_expr='iexact')
    # filtering current company - exact match
    current_company = filters.CharFilter(method='filter_by_current_company', lookup_expr='iexact')
    # filtering for company (generic) - exact match
    company = filters.CharFilter(method='filter_by_all_roles_company', lookup_expr='iexact')

    # filtering for main industry - exact match
    main_industry = filters.CharFilter(method='filter_by_main_industry', lookup_expr='iexact')
    # filtering past industry - exact match
    past_industry = filters.CharFilter(method='filter_by_past_industry', lookup_expr='iexact')
    # filtering current industry - exact match
    current_industry = filters.CharFilter(method='filter_by_current_industry', lookup_expr='iexact')
    # filtering for industry (generic) - exact match
    industry = filters.CharFilter(method='filter_by_all_roles_industry', lookup_expr='iexact')

    # filtering for connection location - contains match
    location = filters.CharFilter(method='filter_by_person_location', label='Person Location')
    # filtering for company location - contains match
    headquarters = filters.CharFilter(method='filter_by_company_headquarters', label='Company Headquarters')

    # filtering on bio, summary, role (past, present, main) description - contains matches
    keyword = filters.CharFilter(method='filter_by_keyword', label='Keyword')

    # filtering for main position - contains match
    main_position = filters.CharFilter(method='filter_by_main_position', label='Main Position')
    # filtering for past position - contains match
    past_position = filters.CharFilter(method='filter_by_past_position', label='Past Position')
    # filtering for current position - contains match
    current_position = filters.CharFilter(method='filter_by_current_position', label='Current Position')
    # filtering for position (generic) - contains match
    position = filters.CharFilter(method='filter_by_all_positions', label='All Positions')

    # filtering on connection w users - exact match
    connected_with = filters.CharFilter(method='filter_by_connected_with', label='Connected With')

    # filtering for main company size
    main_company_size_min = filters.NumberFilter(method='filter_by_main_company_size', label='Main Company Size Min')
    main_company_size_max = filters.NumberFilter(method='filter_by_main_company_size', label='Main Company Size Max')
    # filtering for past company size
    past_company_size_min = filters.NumberFilter(method='filter_by_past_company_size', label='Past Company Size Min')
    past_company_size_max = filters.NumberFilter(method='filter_by_past_company_size', label='Past Company Size Max')
    # filtering for current company size
    current_company_size_min = filters.NumberFilter(method='filter_by_current_company_size', label='Current Company Size Min')
    current_company_size_max = filters.NumberFilter(method='filter_by_current_company_size', label='Current Company Size Max')
    # filtering for company size (generic)
    company_size_min = filters.NumberFilter(method='filter_by_all_company_size', label='All Company Size Min')
    company_size_max = filters.NumberFilter(method='filter_by_all_company_size', label='All Company Size Max')

    # Filtering by function (generic)
    function = filters.CharFilter(method='filter_by_function', label='Function')
    # Filtering by current function
    current_function = filters.CharFilter(method='filter_by_current_function', label='Current Function')

    #sorting flag
    sort_by = filters.CharFilter(method='sort_by_fields', label='Sort By')


    class Meta:
        model = Connection
        fields = []

    def sort_by_fields(self, queryset, name, value):
        """
        Sort the queryset based on the `sort_by` parameter.
        Sort by connection strength in descending order.
        """
        # Parse the `sort_by` parameter (e.g., "connection_strength,-another_field")
        sort_fields = value.split(',')

        # Supported sorting fields
        supported_sorting_fields = {
            'strength': '-connection_strength',  # Descending order for connection strength
        }

        # Apply sorting
        ordering = [
            supported_sorting_fields[field.lstrip('-')]
            for field in sort_fields if field.lstrip('-') in supported_sorting_fields
        ]
        if ordering:
            queryset = queryset.order_by(*ordering)

        return queryset


    # only single filter enabled - one name at a time
    def filter_by_first_name(self, queryset, name, value):
        return queryset.filter(first_name__iexact=value)

    # only single filter enabled - one name at a time
    def filter_by_last_name(self, queryset, name, value):
        return queryset.filter(last_name__iexact=value)
    
    # multi-filtering enabled - works in company A or B
    def filter_by_main_company(self, queryset, name, value):
        companies = value.split(",")
        query = Q()
        for company in companies:
            query |= Q(role__main_role=True, role__company__name__iexact=company.strip())
        return queryset.filter(query).distinct()

    # multi-filtering enabled
    def filter_by_past_company(self, queryset, name, value):
        companies = value.split(",")
        query = Q()
        for company in companies:
            query |= Q(role__main_role=False, role__end_date__isnull=False, role__company__name__iexact=company.strip())
        return queryset.filter(query).distinct()

    # multi-filtering enabled
    def filter_by_current_company(self, queryset, name, value):
        companies = value.split(",")
        query = Q()
        for company in companies:
            query |= Q(role__company__name__iexact=company.strip(), role__end_date__isnull=True)
        return queryset.filter(query).distinct()

    # multi-filtering enabled
    def filter_by_all_roles_company(self, queryset, name, value):
        companies = value.split(",")
        query = Q()
        for company in companies:
            query |= Q(role__company__name__iexact=company.strip())
        return queryset.filter(query).distinct()

    # multi-filtering enabled
    def filter_by_main_industry(self, queryset, name, value):
        industries = value.split(",")
        query = Q()
        for industry in industries:
            query |= Q(role__main_role=True, role__company__industry__iexact=industry.strip())
        return queryset.filter(query).distinct()

    # multi-filtering enabled
    def filter_by_past_industry(self, queryset, name, value):
        industries = value.split(",")
        query = Q()
        for industry in industries:
            query |= Q(role__main_role=False, role__end_date__isnull=False, role__company__industry__iexact=industry.strip())
        return queryset.filter(query).distinct()

    # multi-filtering enabled
    def filter_by_current_industry(self, queryset, name, value):
        industries = value.split(",")
        query = Q()
        for industry in industries:
            query |= Q(role__company__industry__iexact=industry.strip(), role__end_date__isnull=True)
        return queryset.filter(query).distinct()
    
    # multi-filtering enabled
    def filter_by_all_roles_industry(self, queryset, name, value):
        industries = value.split(",")
        query = Q()
        for industry in industries:
            query |= Q(role__company__industry__iexact=industry.strip())
        return queryset.filter(query).distinct()
    
    # multi-filtering enabled
    def filter_by_person_location(self, queryset, name, value):
        locations = value.split(',')
        # Build a Q object to allow multiple `icontains` queries
        query = Q()
        for location in locations:
            query |= Q(location__icontains=location.strip())
        return queryset.filter(query)
    
    # multi-filtering enabled
    def filter_by_company_headquarters(self, queryset, name, value):
        # Split the comma-separated values
        headquarters = value.split(',')
        # Build a Q object for icontains on company headquarters
        query = Q()
        for headquarters in headquarters:
            query |= Q(role__company__headquarters__icontains=headquarters.strip())
        return queryset.filter(query).distinct()
    
    # only single filter enabled - one keyword at a time
    def filter_by_keyword(self, queryset, name, value):
        keywords = value.split(',')
        """
        Search for the keyword in connection bio, summary, and role description.
        """
        query = Q()
        for keyword in keywords:
            escaped_keyword = re.escape(keyword.strip())
            query |= (
                Q(bio__icontains=escaped_keyword) |  # Search in bio
                Q(summary__icontains=escaped_keyword) |  # Search in summary
                Q(role__description__icontains=escaped_keyword)  # Search in role description 
            )
        return queryset.filter(query).distinct()
    
    # multi-filtering enabled
    def filter_by_main_position(self, queryset, name, value):
        positions = value.split(',')
        query = Q()
        for position in positions:
            escaped_position = re.escape(position.strip())
            query |= Q(role__main_role=True, role__position__iregex=fr'\y{escaped_position}\y')
        return queryset.filter(query).distinct()

    # multi-filtering enabled
    def filter_by_past_position(self, queryset, name, value):
        positions = value.split(',')
        query = Q()
        for position in positions:
            escaped_position = re.escape(position.strip())
            query |= Q(role__main_role=False, role__end_date__isnull=False,  role__position__iregex=fr'\y{escaped_position}\y')
        return queryset.filter(query).distinct()

    # multi-filtering enabled
    def filter_by_current_position(self, queryset, name, value):
        positions = value.split(',')
        query = Q()
        for position in positions:
            escaped_position = re.escape(position.strip())
            query |= Q(role__end_date__isnull=True, role__position__iregex=fr'\y{escaped_position}\y')
        return queryset.filter(query).distinct()

    # multi-filtering enabled
    def filter_by_all_positions(self, queryset, name, value):
        positions = value.split(',')
        query = Q()
        for position in positions:
            escaped_position = re.escape(position.strip())
            query |= Q(role__position__iregex=fr'\y{escaped_position}\y')
        return queryset.filter(query).distinct()
    
    # multi-filtering enabled
    def filter_by_connected_with(self, queryset, name, value):
        names = value.split(',')
        query = Q()
        for name in names:
            query |= Q(user_connections__user__first_name__iexact=name.strip())
        return queryset.filter(query).distinct()
    

    # Size  methods: example call /?current_company_size_min=30&?current_company_size_max=20000
    def filter_by_main_company_size(self, queryset, name, value):
        # Retrieve and handle min and max values
        min_value = int(self.data.get('main_company_size_min', 0))  # Default to 0 if not provided
        max_value = int(self.data.get('main_company_size_max', 2**31 - 1))  # Default to a large integer

        return queryset.filter(
            role__company__employee_count__gte=min_value,  # Minimum company size
            role__company__employee_count__lte=max_value,  # Maximum company size
            role__main_role=True
        ).distinct()
    
    def filter_by_past_company_size(self, queryset, name, value):
        # Retrieve and handle min and max values
        min_value = int(self.data.get('past_company_size_min', 0))  # Default to 0 if not provided
        max_value = int(self.data.get('past_company_size_max', 2**31 - 1))  # Default to a large integer

        return queryset.filter(
            role__company__employee_count__gte=min_value,  # Minimum company size
            role__company__employee_count__lte=max_value,  # Maximum company size
            role__end_date__isnull=False,  # Ensure it's a current role
            role__main_role=False
        ).distinct()

    def filter_by_current_company_size(self, queryset, name, value):
        # Retrieve and handle min and max values
        min_value = int(self.data.get('current_company_size_min', 0))  # Default to 0 if not provided
        max_value = int(self.data.get('current_company_size_max', 2**31 - 1))  # Default to a large integer

        return queryset.filter(
            role__company__employee_count__gte=min_value,  # Minimum company size
            role__company__employee_count__lte=max_value,  # Maximum company size
            role__end_date__isnull=True  # Ensure it's a current role
        ).distinct()

    def filter_by_all_company_size(self, queryset, name, value):
        # Retrieve and handle min and max values
        min_value = int(self.data.get('company_size_min', 0))  # Default to 0 if not provided
        max_value = int(self.data.get('company_size_max', 2**31 - 1))  # Default to a large integer

        return queryset.filter(
            role__company__employee_count__gte=min_value,  # Minimum company size
            role__company__employee_count__lte=max_value,  # Maximum company size
        ).distinct()

    # multi-filtering enabled
    def filter_by_function(self, queryset, name, value):
        functions = value.split(',')
        query = Q()
        for function in functions:
            query |= Q(function__function__icontains=function.strip())  # Matches any function name
        return queryset.filter(query).distinct()

    # multi-filtering enabled
    def filter_by_current_function(self, queryset, name, value):
        functions = value.split(',')
        query = Q()
        for function in functions:
            query |= Q(function__function__icontains=function.strip(), function__is_current=True)
        return queryset.filter(query).distinct()


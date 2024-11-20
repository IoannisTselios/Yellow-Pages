# utils.py
import pandas as pd
from django.db import transaction
from .models import Company
import logging

logger = logging.getLogger(__name__)

def save_companies_from_dataframe(df: pd.DataFrame):
    """
    This function saves a DataFrame to the Company model.
    If any row fails, it rolls back all changes.
    """
    with transaction.atomic():  # Ensure atomicity
        for index, row in df.iterrows():

            # Create a new Company instance, handling NaN values appropriately
            company = Company(
                name=row['name'],
                website=row['website'],
                linkedin_link=row['linkedin_link'],
                linkedin_sales_link=row['linkedin_sales_link'],
                company_type=row['company_type'],
                industry=row['industry'],
                description=row['description'] if pd.notna(row['description']) else "",
                employee_count=int(row['employee_count']) if pd.notna(row['employee_count']) else None,
                year_founded=int(row['year_founded']) if pd.notna(row['year_founded']) else None,
                headquarters=row['headquarters'] if pd.notna(row['headquarters']) else "",
                headquarter_country=row['country'] if pd.notna(row['country']) else "",
                specialties=row['specialties'] if pd.notna(row['specialties']) else "",
                investment_stage="",  # Defaults for extra fields not in the CSV
                funding=None
            )
            
            
            # Attempt to save the company
            try:
                # Same code for creating and saving Company instance
                company.save()
                print(f"Saved {company.name} (row {index}) successfully")
            except Exception as e:
                print(f"Failed to save {row['name']} (row {index}): {e}")
                raise e  # Re-raise to trigger transaction rollba

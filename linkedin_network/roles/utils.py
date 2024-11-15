import pandas as pd
from django.db import transaction
from django.core.exceptions import ValidationError
from datetime import datetime
from .models import Connection, Company, Role
import logging

logger = logging.getLogger(__name__)

def save_roles_from_dataframe(df: pd.DataFrame):
    """
    This function saves a DataFrame to the Role model.
    If any row fails, it rolls back all changes.
    """
    with transaction.atomic():  # Ensure atomicity
        for index, row in df.iterrows():
            try:
                # Find the associated Connection by the LinkedIn URL
                connection = Connection.objects.filter(url=row['url']).first()
                if not connection:
                    print(f"Skipping row {index}: Connection not found for LinkedIn URL: {row['url']}")
                    continue  # Skip this row if connection is not found

                # Find the associated Company by the LinkedIn Sales Navigator link
                company = Company.objects.filter(linkedin_sales_link=row['Company_linkedin_sales_link']).first()
                if not company:
                    print(f"Skipping row {index}: Company not found for LinkedIn Sales Navigator URL: {row['Company_linkedin_sales_link']}")
                    continue  # Skip this row if company is not found

                # Parse start and end dates, defaulting to the first of the month
                start_date = parse_first_of_month_date(row['Start Date'])
                end_date = (
                    parse_first_of_month_date(row['End Date'])
                    if pd.notna(row['End Date']) and row['End Date'] != "Present"
                    else None
                )

                # Determine main_role based on the 'main' column in the CSV
                main_role = bool(row.get('Main', False))  # Converts "True"/"False" or 1/0 to boolean

                # Create the Role instance
                role = Role(
                    connection=connection,
                    company=company,
                    position=row['Title'],
                    start_date=start_date,
                    end_date=end_date,
                    main_role=main_role,  # Set based on 'main' column
                    location=row['current_location'] if pd.notna(row['current_location']) else "",
                )

                # Validate and save the Role instance
                role.full_clean()  # Runs the model's clean method for validation
                role.save()
                logger.info(f"Saved Role for {connection.first_name} {connection.last_name} at {company.name} (row {index})")

            except ValidationError as ve:
                logger.error(f"Validation error for Role at row {index}: {ve}")
                raise ve  # Raise to trigger transaction rollback
            except Exception as e:
                logger.error(f"Failed to save Role for row {index}: {e}")
                raise e  # Re-raise to trigger transaction rollback

def parse_first_of_month_date(date_str):
    """
    Parses a date string and returns a datetime.date object with the day set to the first of the month.
    Assumes date_str is in format "YYYY-MM-DD" or similar.
    """
    date = pd.to_datetime(date_str, errors='coerce')
    if pd.isna(date):
        raise ValueError(f"Invalid date format: {date_str}")
    return datetime(date.year, date.month, 1).date()

from django.db import transaction
from django.contrib.auth import get_user_model
from datetime import datetime
import logging
import os
import pandas as pd
from bs4 import BeautifulSoup
from collections import defaultdict


logger = logging.getLogger(__name__)
User = get_user_model()


def read_html_content_for_all_users():
    """
    Reads the HTML content for all users who have a linkedin_comments file.
    Returns a dictionary with user emails as keys and HTML content as values.
    """
    user_html_content = {}

    # Fetch all users with a linked linkedin_comments file
    users_with_html = User.objects.filter(linkedin_comments__isnull=False)

    for user in users_with_html:
        html_file_path = user.linkedin_comments.path  # Full path to the HTML file

        # Ensure the file exists
        if os.path.exists(html_file_path):
            with open(html_file_path, 'r', encoding='utf-8') as html_file:
                content = html_file.read()
                user_html_content[f"{user.first_name} {user.last_name}"] = content  # Use user email as the key
        else:
            print(f"File not found: {html_file_path}")

    return user_html_content

def parse_interactions_from_html(user_html_content):
    """
    Parses interaction data from HTML content.
    Args:
        user_html_content (dict): A dictionary with user emails as keys and HTML content as values.
    Returns:
        DataFrame: A DataFrame with columns ['employee', 'user', 'normalized_interaction_count'].
    """
    interaction_data = defaultdict(int)

    for employee_name, html_content in user_html_content.items():
        soup = BeautifulSoup(html_content, 'html.parser')

        # General comment interactions
        user_elements = soup.find_all('div', class_='update-components-actor__meta')
        for user_element in user_elements:
            name_span = user_element.find('span', class_='update-components-actor__name')
            if name_span:
                full_name = name_span.get_text(strip=True)
                name_parts = full_name.split()
                if len(name_parts) >= 2:
                    first_last_name = f"{name_parts[0]} {name_parts[-1]}"
                else:
                    first_last_name = full_name

                # Record interaction only if target is not the employee themselves
                print(f"Name: {employee_name}")
                if first_last_name != employee_name:
                    interaction_data[(employee_name, first_last_name)] += 1

        # Reply-specific interactions
        reply_elements = soup.find_all('span', class_='update-components-header__text-view')
        for reply_element in reply_elements:
            if employee_name in reply_element.get_text():
                target_name_tag = reply_element.find_all('a')[-1]
                if target_name_tag:
                    target_name = target_name_tag.get_text(strip=True)
                    if target_name != employee_name:
                        interaction_data[(employee_name, target_name)] += 1

    # Normalize interaction data
    normalized_interaction_data = []
    for (employee, target), count in interaction_data.items():
        # Filter to calculate average only for this employee's interactions
        employee_interactions = [count for (e, _), count in interaction_data.items() if e == employee]
        avg_interactions = sum(employee_interactions) / len(employee_interactions) if employee_interactions else 0
        normalized_count = count / avg_interactions if avg_interactions > 0 else 0
        normalized_interaction_data.append((employee, target, normalized_count))

    # Create and return DataFrame
    comments_df = pd.DataFrame(normalized_interaction_data, columns=['employee', 'user', 'normalized_interaction_count'])
    return comments_df


def get_interaction_data():
    """
    High-level function to read HTML content and calculate interaction data.
    Returns:
        DataFrame: A DataFrame with interaction data.
    """
    # Step 1: Read HTML content for all users
    user_html_content = read_html_content_for_all_users()

    # Step 2: Parse interactions from the HTML content
    comments_df = parse_interactions_from_html(user_html_content)

    return comments_df



# ----------



def strength_metric_calculation(connection):
    return 0

def save_connections_from_dataframe(df):
    """
    This function saves connections from a CSV file to the Connection model.
    If any row fails, it rolls back all changes.
    """

    from .models import Connection, UserConnection
    
    with transaction.atomic():  # Ensure atomicity
        for index, row in df.iterrows():
            logger.info(f"Processing row {index}")

            # Parse the connections_agg column
            connections = row['connections']
            connections_data = connections.strip('()').split('), (')
            connection_entries = []
            for entry in connections_data:
                name, timestamp = entry.split(', ')
                connection_entries.append((name.strip(), int(timestamp)))

            # Prepare connection fields
            connection_data = {
                'first_name': row['first_name'],
                'last_name': row['last_name'],
                'bio': row.get('bio', ''),
                'summary': row.get('summary', ''),
                'url': row.get('url', ''),
                'location': row.get('location', ''),
                'country': row.get('country', ''),

            }            

            # Create or update the Connection instance using URL as the unique identifier
            connection, created = Connection.objects.update_or_create(
                url=row.get('url', ''),  # Use URL as the unique field
                defaults=connection_data
            )

            if created:
                print(f"Created new connection for {row['first_name']} {row['last_name']}")
            else:
                print(f"Found existing connection for {row['first_name']} {row['last_name']}")

            # Link each user from connections_agg
            for name, timestamp in connection_entries:
                connected_on = datetime.fromtimestamp(timestamp / 1000)  # Assuming the timestamp is in milliseconds

                # Find the user by first name
                user = User.objects.filter(first_name=name).first()
                if user:
                    UserConnection.objects.create(
                        user=user,
                        connection=connection,
                        connected_on=connected_on
                    )
                    print(f"Linked {connection.first_name} {connection.last_name} to user {user.first_name}")
                else:
                    print(f"No user found with first name '{name}' for connection {connection.first_name} {connection.last_name}")

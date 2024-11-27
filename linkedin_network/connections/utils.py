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
        DataFrame: A DataFrame with columns ['url1', 'url2', 'normalized_interaction_count'].
    """
    interaction_data = defaultdict(int)

    for employee_name, html_content in user_html_content.items():
        soup = BeautifulSoup(html_content, 'html.parser')

        # Extract URL for the employee
        employee_url = next(
            (a['href'] for a in soup.find_all('a', href=True) if employee_name in a.get_text(strip=True)), None
        )
        if not employee_url:
            continue

        # General comment interactions
        user_elements = soup.find_all('div', class_='update-components-actor__meta')
        for user_element in user_elements:
            url_tag = user_element.find('a', href=True)
            if url_tag:
                user_url = url_tag['href']
                if user_url != employee_url:  # Avoid self-interactions
                    interaction_data[(employee_url, user_url)] += 1

    # Normalize interaction data
    normalized_interaction_data = []
    for (url1, url2), count in interaction_data.items():
        # Filter to calculate average only for this employee's interactions
        employee_interactions = [count for (e, _), count in interaction_data.items() if e == url1]
        avg_interactions = sum(employee_interactions) / len(employee_interactions) if employee_interactions else 0
        normalized_count = count / avg_interactions if avg_interactions > 0 else 0
        normalized_interaction_data.append((url1, url2, normalized_count))

    # Create and return DataFrame
    comments_df = pd.DataFrame(normalized_interaction_data, columns=['url1', 'url2', 'normalized_interaction_count'])
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


def calculate_employment_overlap():
    """
    Calculate overlapping employment periods for employees within the same company,
    and identify overlaps for Dreamcraft employees.

    Returns:
        tuple: Two DataFrames:
            - overlap_df: A DataFrame with all overlapping employment data using URLs.
            - dreamcraft_overlaps: A DataFrame with overlaps involving Dreamcraft employees.
    """
    from roles.models import Role
    from django.contrib.auth import get_user_model

    # Hardcoded Dreamcraft employee names
    dreamcraft_employee_names = [
        "Nico Blier-Silvestri", "Andreas Sachse", "Carsten Gjoertler Salling",
        "Daniel Nyvang Székely Mariussen", "Frederik Pheiffer", "Heidi Lee",
        "Hendrik Sippel", "Julie Lindegaard Larsen", "Lasse Surland",
        "Line S. Aasen", "Mads Esmarch Hansen"
    ]

    # Fetch Dreamcraft employee URLs
    User = get_user_model()
    dreamcraft_employees = set()
    for full_name in dreamcraft_employee_names:
        first_name, last_name = full_name.split(" ", 1)
        user = User.objects.filter(first_name=first_name, last_name=last_name).first()
        if user and user.url:
            dreamcraft_employees.add(user.url)

    # Dictionary to store employment periods by company
    employment_by_company = defaultdict(list)

    # Fetch all roles from the database
    roles = Role.objects.select_related('connection', 'company')

    # Organize roles by company using URLs
    for role in roles:
        employee_url = role.connection.url
        start_date = role.start_date
        end_date = role.end_date or datetime.today().date()  # Use today's date for ongoing roles
        company_name = role.company.name

        # Append employee and their role period to the company's employment list
        employment_by_company[company_name].append((employee_url, start_date, end_date))

    # List to store unique overlap data
    overlap_data = []

    # Check for overlapping employment periods within each company
    for company, employments in employment_by_company.items():
        for i, (url1, start1, end1) in enumerate(employments):
            for j, (url2, start2, end2) in enumerate(employments):
                # Ensure url1 and url2 are not the same and only calculate once for each unique pair
                if i < j and url1 != url2:
                    overlap_start = max(start1, start2)
                    overlap_end = min(end1, end2)
                    
                    # Calculate overlap duration
                    if overlap_start <= overlap_end:
                        overlap_duration = (overlap_end.year - overlap_start.year) * 12 + (overlap_end.month - overlap_start.month)
                        if overlap_duration > 0:
                            overlap_data.append({
                                "url1": url1,
                                "url2": url2,
                                "company": company,
                                "worked_for": overlap_duration
                            })

    # Convert overlap data to DataFrame
    overlap_df = pd.DataFrame(overlap_data, columns=['url1', 'url2', 'company', 'worked_for'])

    # Filter for Dreamcraft employee overlaps
    dreamcraft_overlaps = overlap_df[
        (overlap_df['url1'].isin(dreamcraft_employees)) |
        (overlap_df['url2'].isin(dreamcraft_employees))
    ]

    return overlap_df, dreamcraft_overlaps


def aggregate_and_filter_employment_overlap(overlap_df, threshold=360):
    """
    Aggregates overlapping employment data, filters unrealistic entries,
    and separates realistic entries for further use.

    Args:
        overlap_df (DataFrame): The DataFrame containing overlapping employment data.
        threshold (int): Maximum realistic employment duration in months. Default is 360.

    Returns:
        tuple: Three DataFrames:
            - aggregated_df: Aggregated overlapping employment data.
            - realistic_entries: Entries with total worked_for below or equal to the threshold.
            - unrealistic_entries: Entries with total worked_for exceeding the threshold.
    """
    # Step 1: Aggregate total 'worked_for' duration for each unique name pair
    aggregated_df = overlap_df.groupby(['url1', 'url2'], as_index=False)['worked_for'].sum()

    # Step 2: Filter out unrealistic entries where worked_for exceeds the threshold
    realistic_entries = aggregated_df[aggregated_df['worked_for'] <= threshold]
    unrealistic_entries = aggregated_df[aggregated_df['worked_for'] > threshold]

    # Step 3: Return the results as DataFrames
    return aggregated_df, realistic_entries, unrealistic_entries


def filter_dreamcraft_overlaps(realistic_entries, dreamcraft_employees):
    """
    Filters overlapping employment data for Dreamcraft employees.

    Args:
        realistic_entries (DataFrame): The DataFrame containing filtered realistic employment overlaps.
        dreamcraft_employees (set): A set of names of Dreamcraft employees.

    Returns:
        DataFrame: A DataFrame containing overlaps involving Dreamcraft employees.
    """
    # Filter rows where either 'name1' or 'name2' is in the Dreamcraft employees set
    dreamcraft_overlaps = realistic_entries[
        (realistic_entries['url1'].isin(dreamcraft_employees)) |
        (realistic_entries['url2'].isin(dreamcraft_employees))
    ]

    return dreamcraft_overlaps


def calculate_connection_strength(comments_df, overlap_df, W_comments=0.4, W_overlap=0.6):
    """
    Calculates the connection strength metric based on comments and work overlap data.

    Args:
        comments_df (DataFrame): DataFrame containing comment interactions with columns 
                                 ['url1', 'url2', 'normalized_interaction_count'].
        overlap_df (DataFrame): DataFrame containing work overlap data with columns 
                                ['url1', 'url2', 'worked_for'].
        W_comments (float): Weight for comment interactions. Default is 0.4.
        W_overlap (float): Weight for work overlap. Default is 0.6.

    Returns:
        DataFrame: DataFrame containing the connection strength metric with columns 
                   ['url1', 'url2', 'connection_strength'].
    """
    # Step 1: Normalize work overlap duration
    max_overlap = overlap_df['worked_for'].max()
    overlap_df['overlap_score'] = overlap_df['worked_for'] / max_overlap

    # Step 2: Merge comments data with the overlap data on URLs
    connections_df = pd.merge(comments_df, overlap_df, on=['url1', 'url2'], how='outer')

    # Fill NaN values in scores with 0 (no comments or no work overlap)
    connections_df['normalized_interaction_count'].fillna(0, inplace=True)
    connections_df['overlap_score'].fillna(0, inplace=True)

    # Step 3: Calculate the Connection Strength Metric
    connections_df['connection_strength'] = (
        W_comments * connections_df['normalized_interaction_count'] +
        W_overlap * connections_df['overlap_score']
    )

    # Step 4: Return the final DataFrame
    return connections_df[['url1', 'url2', 'connection_strength']]


def replace_names_with_urls(connection_strength_df):
    from django.contrib.auth import get_user_model
    """
    Replaces employee and user names in the connection_strength_df with their LinkedIn URLs.

    Args:
        connection_strength_df (DataFrame): DataFrame containing 'employee' and 'user' columns.

    Returns:
        DataFrame: Updated DataFrame with names replaced by LinkedIn URLs.
    """
    User = get_user_model()

    # Fetch all users with their names and URLs
    user_data = User.objects.values('first_name', 'last_name', 'url')

    # Create a mapping of "First Last" -> URL
    name_to_url = {
        f"{user['first_name']} {user['last_name']}": user['url']
        for user in user_data
    }

    # Replace 'employee' and 'user' names with their corresponding URLs
    connection_strength_df['employee'] = connection_strength_df['employee'].map(name_to_url)
    connection_strength_df['user'] = connection_strength_df['user'].map(name_to_url)

    return connection_strength_df


def update_user_connection_strength(connection_strength_df):
    """
    Updates the connection_strength field in the Connection model
    for the user's URL in existing connections.

    Args:
        connection_strength_df (DataFrame): DataFrame containing LinkedIn URLs
                                             and connection_strength values.
    """
    from connections.models import Connection
    for _, row in connection_strength_df.iterrows():
        # Extract employee (URL), user (URL), and connection_strength
        user_url = row['url2']
        strength_value = row['connection_strength']

        # Update only if the connection exists for the user
        try:
            connection = Connection.objects.get(url=user_url)
            connection.connection_strength = strength_value
            connection.save()
        except Connection.DoesNotExist:
            pass


def process_dreamcraft_connection_strength():
    """
    Orchestrates the process of calculating the connection strength metric for Dreamcraft employees.

    Returns:
        DataFrame: Final DataFrame containing connection strength metrics with LinkedIn URLs.
    """
    # Step 1: Read and parse interaction data from HTML comments
    print("Step 1: Reading and parsing HTML comments...")
    comments_df = get_interaction_data()
    print(f"Parsed {len(comments_df)} interactions.")

    # Step 2: Calculate employment overlaps and filter Dreamcraft overlaps
    print("Step 2: Calculating employment overlaps...")
    overlap_df, dreamcraft_overlaps = calculate_employment_overlap()
    print(f"Calculated {len(overlap_df)} total overlaps, {len(dreamcraft_overlaps)} involve Dreamcraft employees.")

    # Step 3: Aggregate and filter realistic overlaps
    print("Step 3: Aggregating and filtering realistic overlaps...")
    aggregated_df, realistic_entries, _ = aggregate_and_filter_employment_overlap(overlap_df)
    dreamcraft_employees = set(dreamcraft_overlaps['url1']).union(set(dreamcraft_overlaps['url2']))
    filtered_dreamcraft_overlaps = filter_dreamcraft_overlaps(realistic_entries, dreamcraft_employees)
    print(f"Filtered {len(filtered_dreamcraft_overlaps)} realistic overlaps involving Dreamcraft employees.")

    # Step 4: Calculate connection strength metric
    print("Step 4: Calculating connection strength metric...")
    connection_strength_df = calculate_connection_strength(comments_df, filtered_dreamcraft_overlaps)
    print(f"Calculated connection strength for {len(connection_strength_df)} connections.")

    # No Step 5: The URLs are already included throughout the pipeline.
    
    # Return the final DataFrame
    return connection_strength_df


if __name__ == "__main__":
    # Step 1: Run the process to compute connection strengths
    connection_strength_df = process_dreamcraft_connection_strength()

    # Step 2: Update the database with the computed strengths
    update_user_connection_strength(connection_strength_df)

    print("Connection strengths updated for existing user connections.")

# ----------


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

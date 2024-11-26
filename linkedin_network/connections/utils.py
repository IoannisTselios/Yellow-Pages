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
                # print(f"Name: {employee_name}")
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


def calculate_employment_overlap():
    """
    Calculate overlapping employment periods for employees within the same company,
    and identify overlaps for Dreamcraft employees.

    Returns:
        tuple: Two DataFrames:
            - overlap_df: A DataFrame with all overlapping employment data.
            - dreamcraft_overlaps: A DataFrame with overlaps involving Dreamcraft employees.
    """
    from roles.models import Role, Company

    # Get the Dreamcraft company name
    try:
        dreamcraft_company = Company.objects.get(name__icontains="Dreamcraft")
        dreamcraft_company_name = dreamcraft_company.name
    except Company.DoesNotExist:
        raise ValueError("Dreamcraft company not found in the database.")

    # Dictionary to store employment periods by company
    employment_by_company = defaultdict(list)

    # Fetch all roles from the database
    roles = Role.objects.select_related('connection', 'company')

    # Organize roles by company
    dreamcraft_employees = set()

    for role in roles:
        employee_name = f"{role.connection.first_name} {role.connection.last_name}"
        start_date = role.start_date
        end_date = role.end_date or datetime.today().date()  # Use today's date for ongoing roles
        company_name = role.company.name

        # Append employee and their role period to the company's employment list
        employment_by_company[company_name].append((employee_name, start_date, end_date))

        # Collect Dreamcraft employees
        if company_name == dreamcraft_company_name:
            dreamcraft_employees.add(employee_name)

    # List to store unique overlap data
    overlap_data = []

    # Check for overlapping employment periods within each company
    for company, employments in employment_by_company.items():
        for i, (emp1, start1, end1) in enumerate(employments):
            for j, (emp2, start2, end2) in enumerate(employments):
                # Ensure emp1 and emp2 are not the same and only calculate once for each unique pair
                if i < j and emp1 != emp2:
                    # Sort the pair to ensure uniqueness (name1, name2) == (name2, name1)
                    name_pair = tuple(sorted((emp1, emp2)))
                    overlap_start = max(start1, start2)
                    overlap_end = min(end1, end2)
                    
                    # Calculate overlap duration
                    if overlap_start <= overlap_end:
                        overlap_duration = (overlap_end.year - overlap_start.year) * 12 + (overlap_end.month - overlap_start.month)
                        if overlap_duration > 0:
                            overlap_data.append({
                                "name1": name_pair[0],
                                "name2": name_pair[1],
                                "company": company,
                                "worked_for": overlap_duration
                            })

    # Convert overlap data to DataFrame
    overlap_df = pd.DataFrame(overlap_data, columns=['name1', 'name2', 'company', 'worked_for'])

    # Filter for Dreamcraft employee overlaps
    dreamcraft_overlaps = overlap_df[
        (overlap_df['name1'].isin(dreamcraft_employees)) |
        (overlap_df['name2'].isin(dreamcraft_employees))
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
    aggregated_df = overlap_df.groupby(['name1', 'name2'], as_index=False)['worked_for'].sum()

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
        (realistic_entries['name1'].isin(dreamcraft_employees)) |
        (realistic_entries['name2'].isin(dreamcraft_employees))
    ]

    return dreamcraft_overlaps


def calculate_connection_strength(comments_df, overlap_df, W_comments=0.4, W_overlap=0.6):
    """
    Calculates the connection strength metric based on comments and work overlap data.

    Args:
        comments_df (DataFrame): DataFrame containing comment interactions with columns 
                                 ['employee', 'user', 'normalized_interaction_count'].
        overlap_df (DataFrame): DataFrame containing work overlap data with columns 
                                ['name1', 'name2', 'worked_for'].
        W_comments (float): Weight for comment interactions. Default is 0.4.
        W_overlap (float): Weight for work overlap. Default is 0.6.

    Returns:
        DataFrame: DataFrame containing the connection strength metric with columns 
                   ['employee', 'user', 'connection_strength'].
    """
    # Step 1: Normalize work overlap duration
    max_overlap = overlap_df['worked_for'].max()
    overlap_df['overlap_score'] = overlap_df['worked_for'] / max_overlap

    # Step 2: Prepare overlap data to allow both 'name1' and 'name2' as employees
    overlap_df1 = overlap_df[['name1', 'name2', 'overlap_score']].rename(columns={'name1': 'employee', 'name2': 'user'})
    overlap_df2 = overlap_df[['name2', 'name1', 'overlap_score']].rename(columns={'name2': 'employee', 'name1': 'user'})
    combined_overlap_df = pd.concat([overlap_df1, overlap_df2], ignore_index=True)

    # Step 3: Merge comments data with the combined overlap data on employee and user names
    connections_df = pd.merge(comments_df, combined_overlap_df, on=['employee', 'user'], how='outer')

    # Fill NaN values in scores with 0 (no comments or no work overlap)
    connections_df['normalized_interaction_count'].fillna(0, inplace=True)
    connections_df['overlap_score'].fillna(0, inplace=True)

    # Step 4: Calculate the Connection Strength Metric
    connections_df['connection_strength'] = (
        W_comments * connections_df['normalized_interaction_count'] +
        W_overlap * connections_df['overlap_score']
    )

    # Step 5: Return the final DataFrame
    return connections_df[['employee', 'user', 'connection_strength']]


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
        user_url = row['user']
        strength_value = row['connection_strength']

        # Update only if the connection exists for the user
        try:
            connection = Connection.objects.get(url=user_url)
            connection.connection_strength = strength_value
            connection.save()
            # print(f"Updated connection_strength for {user_url}")
        except Connection.DoesNotExist:
            pass
            # print(f"Connection not found for {user_url}. Skipping update.")


def process_dreamcraft_connection_strength():
    """
    Orchestrates the process of calculating the connection strength metric for Dreamcraft employees.

    Returns:
        DataFrame: Final DataFrame containing connection strength metrics with LinkedIn URLs.
    """
    # Step 1: Read and parse interaction data from HTML comments
    print("Step 1: Reading and parsing HTML comments...")
    comments_df = get_interaction_data()
    # print(f"Parsed {len(comments_df)} interactions.")

    # Step 2: Calculate employment overlaps and filter Dreamcraft overlaps
    print("Step 2: Calculating employment overlaps...")
    overlap_df, dreamcraft_overlaps = calculate_employment_overlap()
    # print(f"Calculated {len(overlap_df)} total overlaps, {len(dreamcraft_overlaps)} involve Dreamcraft employees.")

    # Step 3: Aggregate and filter realistic overlaps
    print("Step 3: Aggregating and filtering realistic overlaps...")
    aggregated_df, realistic_entries, _ = aggregate_and_filter_employment_overlap(overlap_df)
    dreamcraft_employees = set(dreamcraft_overlaps['name1']).union(set(dreamcraft_overlaps['name2']))
    filtered_dreamcraft_overlaps = filter_dreamcraft_overlaps(realistic_entries, dreamcraft_employees)
    # print(f"Filtered {len(filtered_dreamcraft_overlaps)} realistic overlaps involving Dreamcraft employees.")

    # Step 4: Calculate connection strength metric
    print("Step 4: Calculating connection strength metric...")
    connection_strength_df = calculate_connection_strength(comments_df, filtered_dreamcraft_overlaps)
    # print(f"Calculated connection strength for {len(connection_strength_df)} connections.")

    # Step 5: Replace names with LinkedIn URLs
    print("Step 5: Replacing names with LinkedIn URLs...")
    connection_strength_df = replace_names_with_urls(connection_strength_df)
    # print("Replaced names with LinkedIn URLs.")

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

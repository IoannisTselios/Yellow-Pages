from django.db import transaction
from django.contrib.auth import get_user_model
from datetime import datetime
import logging
import os
import pandas as pd
from bs4 import BeautifulSoup
from collections import defaultdict
import pandas as pd
import json
from datetime import datetime

logger = logging.getLogger(__name__)
User = get_user_model()

def read_html_content_for_all_users():
    """
    Reads the HTML content for all users who have a valid linkedin_comments file.
    Returns a dictionary with user emails as keys and HTML content as values.
    """
    user_html_content = {}

    # Fetch all users with a valid linkedin_comments file
    users_with_html = User.objects.filter(linkedin_comments__isnull=False).exclude(linkedin_comments="")

    for idx, user in enumerate(users_with_html, start=1):
        html_file_path = user.linkedin_comments.path  # Full path to the HTML file

        # Ensure the file exists
        if os.path.exists(html_file_path):
            with open(html_file_path, 'r', encoding='utf-8') as html_file:
                content = html_file.read()
                user_html_content[f"{user.first_name} {user.last_name}"] = content  # Use user name as the key
            # Print the file path along with the user name
            print(f"{idx}: Processing employee: {user.first_name} {user.last_name}, HTML Path: {html_file_path}")
        else:
            print(f"{idx}: Processing employee: {user.first_name} {user.last_name} (File not found: {html_file_path})")

    return user_html_content


def parse_interactions_from_html(user_html_content):
    import pandas as pd
    from bs4 import BeautifulSoup
    from collections import defaultdict
    import os
    from connections.models import Connection

    connection_urls = {
        f"{conn.first_name} {conn.last_name}": conn.url
        for conn in Connection.objects.all()
    }

    # Employee names mapped to their URLs
    employee_urls = {
        "Frederik Pheiffer": "https://www.linkedin.com/in/frederikpheiffer",              # Nico Blier-Silvestri
        "Heidi Lee": "https://www.linkedin.com/in/heidi-h-lee",             # Andreas Sachse
        "Hendrik Sippel": "https://www.linkedin.com/in/hendrik-sippel",       # Carsten Gjoertler Salling
        "Julie Lindegaard_Larsen": "https://www.linkedin.com/in/julielindegaardlarsen",                # Daniel Nyvang Székely Mariussen
        "Mads Esmarch_Hansen": "https://www.linkedin.com/in/mads-esmarch-hansen-8a29b9151",             # Frederik Pheiffer
        "Nico Blier-Silvestri": "https://www.linkedin.com/in/nicoblier",                    # Heidi Lee
        "Carsten Gjoertler Salling": "https://www.linkedin.com/in/carstensalling",                  # Hendrik Sippel
        "Daniel Nyvang Szekely Mariussen": "https://www.linkedin.com/in/danielnyvang",                # Julie Lindegaard Larsen
    }

    # Initialize a dictionary to accumulate interaction data as (employee_name, target_name) pairs
    interaction_data = defaultdict(int)

    # Step 1: Calculate interactions using names
    for idx, (html_content) in enumerate(user_html_content.values(), start=1):
        employee_name = list(employee_urls.keys())[idx - 1]  # Get the name based on the index
        print(f"{idx}: Processing employee: {employee_name}")
        # Your processing code here
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
                print(first_last_name)
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

    # Step 2: Normalize interactions using names
    normalized_interaction_data = []
    for (employee_name, target_name), count in interaction_data.items():
        # Filter to calculate average only for this employee's interactions
        employee_interactions = [count for (e, _), count in interaction_data.items() if e == employee_name]
        avg_interactions = sum(employee_interactions) / len(employee_interactions) if employee_interactions else 0
        normalized_count = count / avg_interactions if avg_interactions > 0 else 0
        normalized_interaction_data.append((employee_name, target_name, normalized_count))

    # Step 3: Replace names with URLs in the final DataFrame
    comments_df = pd.DataFrame(normalized_interaction_data, columns=['employee_name', 'target_name', 'normalized_interaction_count'])

    # Add URL columns by mapping from employee_urls
    comments_df['url1'] = comments_df['employee_name'].map(employee_urls)
    comments_df['url2'] = comments_df['target_name'].map(connection_urls)

    # Drop rows where URL mapping failed (target might not be an employee)
    comments_df = comments_df.dropna(subset=['url1', 'url2'])

    return comments_df[['url1', 'url2', 'normalized_interaction_count']]


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
    import pandas as pd
    from collections import defaultdict
    from datetime import datetime
    from roles.models import Role

    # Helper function to parse experience data
    def parse_experience(experience_str):
        if pd.isna(experience_str):
            return []
        try:
            return json.loads(experience_str.replace("'", "\""))
        except json.JSONDecodeError:
            return []

    # Helper function to parse dates
    def parse_date(year, month):
        if year is None or month is None:
            return None
        try:
            return datetime(year, month, 1)
        except ValueError:
            return None

    # Load the Dreamcraft employee CSV
    df = pd.read_csv('/usr/src/app/media/dreamcraft_employees.csv')  # Replace with the actual file path
    df['experience'] = df['experience'].apply(parse_experience)

    # Dictionary to store employment periods by company for Dreamcraft employees
    dreamcraft_employments = defaultdict(list)

    # Process employees from the CSV
    for _, row in df.iterrows():
        employee_url = row['url']
        experiences = row['experience']

        for job in experiences:
            company_name = job.get('organisation', {}).get('name', "Unknown")
            start = job['timePeriod'].get('startedOn', {})
            end = job['timePeriod'].get('endedOn', {"year": datetime.today().year, "month": datetime.today().month})
            
            start_date = parse_date(start.get('year'), start.get('month'))
            end_date = parse_date(end.get('year'), end.get('month'))

            if start_date and end_date:
                dreamcraft_employments[company_name].append((employee_url, start_date, end_date))

    # Dictionary to store employment periods by company for all employees
    employment_by_company = defaultdict(list)

    # Fetch all roles from the database
    roles = Role.objects.select_related('connection', 'company')

    # Organize roles by company using URLs
    for role in roles:
        employee_url = role.connection.url
        start_date = role.start_date if role.start_date else None
        end_date = role.end_date if role.end_date else datetime.today().date()  # Ensure consistent date type
        company_name = role.company.name

        if start_date and end_date:
            employment_by_company[company_name].append((employee_url, start_date, end_date))

    # List to store unique overlap data
    overlap_data = []

    # Check for overlapping employment periods
    for company, employments in employment_by_company.items():
        # Combine Dreamcraft employments with the current company employments
        if company in dreamcraft_employments:
            dreamcraft_employments_in_company = dreamcraft_employments[company]
        else:
            dreamcraft_employments_in_company = []

        # Compare Dreamcraft employees with everyone else in the company
        for url1, start1, end1 in dreamcraft_employments_in_company:
            for url2, start2, end2 in employments:
                if url1 != url2:  # Avoid self-comparisons
                    overlap_start = max(start1, start2)
                    overlap_end = min(end1, end2)

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
    dreamcraft_urls = set([url for company in dreamcraft_employments for url, _, _ in dreamcraft_employments[company]])
    dreamcraft_overlaps = overlap_df[
        (overlap_df['url1'].isin(dreamcraft_urls)) |
        (overlap_df['url2'].isin(dreamcraft_urls))
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
        user_url = row['url1']
        strength_value = row['connection_strength']

        # Update only if the connection exists for the user
        try:
            connection = Connection.objects.get(url=user_url)
            connection.connection_strength = strength_value
            connection.save()
            print("Found and updated connection strength for", user_url)
        except Connection.DoesNotExist:
            print("Connection not found for", user_url)


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

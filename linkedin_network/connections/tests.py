from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import datetime, date
from connections.models import Connection, UserConnection
from roles.models import Role, Company
from users.models import User  # Import your custom User model
from django.test import TestCase
from connections.utils import process_dreamcraft_connection_strength


class ConnectionStrengthTestCase(TestCase):
    def setUp(self):
        """
        Set up test data for the test database.
        """
        # Create a mock file for linkedin_comments
        mock_html_content = """
        <html>
            <body>
                <div class="update-components-actor__meta">
                    <span class="update-components-actor__name">Jane Smith</span>
                </div>
                <span class="update-components-header__text-view">
                    <a>John Doe</a>
                </span>
            </body>
        </html>
        """
        mock_file = SimpleUploadedFile("mock_comments.html", mock_html_content.encode('utf-8'), content_type="text/html")

        # Create a test company
        dreamcraft = Company.objects.create(name="Dreamcraft")

        # Create test users with LinkedIn URLs
        user1 = User.objects.create(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            url="https://linkedin.com/in/johndoe",
            linkedin_comments=mock_file
        )
        user2 = User.objects.create(
            first_name="Jane",
            last_name="Smith",
            email="jane.smith@example.com",
            url="https://linkedin.com/in/janesmith",
            linkedin_comments=mock_file
        )

        # Create connections for the users
        connection1 = Connection.objects.create(
            first_name="John",
            last_name="Doe",
            url=user1.url,
            connection_strength=0.0
        )
        connection2 = Connection.objects.create(
            first_name="Jane",
            last_name="Smith",
            url=user2.url,
            connection_strength=0.0
        )

        # Create roles for the users within Dreamcraft
        Role.objects.create(
            connection=connection1,
            company=dreamcraft,
            start_date=date(2020, 1, 1),
            end_date=date(2022, 1, 1)
        )
        Role.objects.create(
            connection=connection2,
            company=dreamcraft,
            start_date=date(2021, 1, 1),
            end_date=date(2023, 1, 1)
        )

        # Create dummy UserConnections
        UserConnection.objects.create(
            user=user1,
            connection=connection2,
            connected_on=datetime(2021, 6, 1)
        )

    def test_process_dreamcraft_connection_strength(self):
        """
        Test the process_dreamcraft_connection_strength function.
        """
        # Run the function
        result = process_dreamcraft_connection_strength()

        # Assert that the result is not empty
        self.assertIsNotNone(result)
        self.assertGreater(len(result), 0)

        # Assert specific values in the result (optional)
        # Example: Check if specific employees appear in the result
        self.assertTrue("https://linkedin.com/in/johndoe" in result['employee'].values)
        self.assertTrue("https://linkedin.com/in/janesmith" in result['user'].values)

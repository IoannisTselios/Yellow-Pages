from django.test import TestCase
from connections.utils import process_dreamcraft_connection_strength
from connections.models import Connection, UserConnection
from roles.models import Role, Company

class ConnectionStrengthTestCase(TestCase):
    def setUp(self):
        """
        Set up test data for the test database.
        """
        # Create a test company
        dreamcraft = Company.objects.create(name="Dreamcraft")

        # Create test employees with roles
        connection1 = Connection.objects.create(first_name="John", last_name="Doe")
        connection2 = Connection.objects.create(first_name="Jane", last_name="Smith")
        connection3 = Connection.objects.create(first_name="Alice", last_name="Johnson")

        Role.objects.create(
            connection=connection1,
            company=dreamcraft,
            start_date="2020-01-01",
            end_date="2022-01-01"
        )
        Role.objects.create(
            connection=connection2,
            company=dreamcraft,
            start_date="2021-01-01",
            end_date="2023-01-01"
        )
        Role.objects.create(
            connection=connection3,
            company=dreamcraft,
            start_date="2019-01-01",
            end_date=None  # Ongoing
        )

        # Create dummy UserConnections (you can expand this as needed)
        UserConnection.objects.create(
            user=connection1,
            connection=connection2,
            connected_on="2021-06-01"
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
        self.assertTrue("John Doe" in result['employee'].values)
        self.assertTrue("Jane Smith" in result['user'].values)

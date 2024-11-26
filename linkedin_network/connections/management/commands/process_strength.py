from django.core.management.base import BaseCommand
from connections.utils import process_dreamcraft_connection_strength, update_user_connection_strength

class Command(BaseCommand):
    help = "Process and update connection strength metrics"

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting connection strength processing...")
        
        # Step 1: Process connection strengths
        connection_strength_df = process_dreamcraft_connection_strength()
        
        # Step 2: Update the database
        update_user_connection_strength(connection_strength_df)
        
        self.stdout.write("Connection strengths updated successfully.")

# Yellow Pages
Organisational wide LinkedIn network mapping

## Admin Set-up

### Initial Set-up

1. Install Docker Desktop and its VS Code plugin
2. Clone the project
3. Navigate to the linkedin_network folder
```
cd digital-media/linkedin_network
```
4. Run one of the following depending on your computer architecture and django version
```
docker compose --env-file .env.dev up -d --build
```
5. From the Docker plugin find the web service, right click it and attach shell
6. In the web service shell run
```
python manage.py createsuperuser
```
and fill in your user's credentials

7. Navigate to http://localhost:8000/admin on your browser.

### Set-up
If the containers are already build then just run `docker-compose up`.

To shut down the project (while not distruing the build) run `docker-compose down`. 

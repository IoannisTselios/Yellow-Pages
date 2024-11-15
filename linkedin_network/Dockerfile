# Base image: Using official Python 3.12-slim-buster
# FROM python:3.12.0b1-slim-buster
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Set environment variables to prevent .pyc files and enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy the requirements file to the container
COPY ./requirements.txt /usr/src/app/requirements.txt

# Install the dependencies from the requirements file
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the entire project into the container's working directory
COPY . /usr/src/app

# Copy the start.sh script into the container
COPY start.sh /usr/src/app/start.sh

# Ensure the start.sh file has executable permissions
RUN chmod +x /usr/src/app/start.sh

# Expose the port
EXPOSE 8000

# Run the start.sh script
CMD ["/usr/src/app/start.sh"]

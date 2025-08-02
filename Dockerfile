# Use the official PHP image with Apache as the base image
FROM php:8.2-apache

# Set the working directory inside the container
WORKDIR /var/www/html

# Install PostgreSQL PDO extension, which is required to connect to the database
# The extension allows PHP to communicate with PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo pdo_pgsql

# Enable Apache's rewrite module, which is common for web applications
# This module allows you to use clean URLs
RUN a2enmod rewrite

# Copy your local PHP project files into the container's web root directory
# The project files will be mounted via a volume in docker-compose.yml,
# but this is good practice for building the image
COPY . .

# Expose port 80 to allow external access to the Apache server
EXPOSE 80
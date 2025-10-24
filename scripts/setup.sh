#!/bin/bash

# This script sets up the development environment for the multi-file-repo project.

# Update package lists
echo "Updating package lists..."
sudo apt-get update

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Run database migrations (if applicable)
# echo "Running database migrations..."
# python manage.py migrate

# Start the development server
echo "Starting the development server..."
# python src/main.py &

echo "Setup complete!"
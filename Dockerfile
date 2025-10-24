FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the Python requirements file and install dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir -r <(pip freeze)

# Copy the source code into the container
COPY src/ ./src/

# Copy the scripts
COPY scripts/ ./scripts/

# Expose the necessary port (if applicable)
EXPOSE 8000

# Command to run the application
CMD ["python", "src/main.py"]
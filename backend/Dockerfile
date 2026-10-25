FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (for building psycopg2 if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run initial seed check and then start uvicorn
CMD ["sh", "-c", "python seed_data.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]

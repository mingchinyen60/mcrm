#!/usr/bin/env bash
# =================================================================
# Synology NAS Precision CRM Deployment Script
# Target: 192.168.1.224
# =================================================================

set -e

SYNOLOGY_IP="192.168.1.224"
REMOTE_DIR="/volume1/docker/crm"

echo "=== Precision CRM Deployment Utility for Synology NAS ==="
echo "Target NAS: $SYNOLOGY_IP"
echo "Target Directory: $REMOTE_DIR"

# 1. Ensure .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# 2. Package instructions
echo ""
echo "Select deployment method:"
echo "1) Deploy via Docker Compose locally/remotely"
echo "2) Create deployment archive (tar.gz) for Synology File Station upload"
read -p "Enter choice [1 or 2]: " choice

if [ "$choice" == "2" ]; then
    ARCHIVE_NAME="precision-crm-synology.tar.gz"
    echo "Packaging project into $ARCHIVE_NAME (excluding node_modules and venv)..."
    tar --exclude='./frontend/node_modules' \
        --exclude='./backend/.venv' \
        --exclude='./backend/__pycache__' \
        --exclude='./.git' \
        -czvf "$ARCHIVE_NAME" .
    echo ""
    echo "SUCCESS: $ARCHIVE_NAME created."
    echo "Next steps:"
    echo "1. Open Synology DSM -> File Station"
    echo "2. Upload $ARCHIVE_NAME to /docker/crm/"
    echo "3. Extract here"
    echo "4. Open Container Manager -> Project -> Create -> Source: Existing docker-compose.yml"
else
    echo "Starting build and containers with docker compose..."
    docker compose up -d --build
    echo ""
    echo "Containers successfully initialized!"
    echo "Frontend: http://$SYNOLOGY_IP:3000"
    echo "API Docs: http://$SYNOLOGY_IP:8000/docs"
fi

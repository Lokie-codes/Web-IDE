#!/bin/bash

echo "🚀 Starting CodeForge IDE..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start services
echo "📦 Starting services with Docker Compose..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ CodeForge IDE is ready!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:3001"
echo "⚙️  Piston:   http://localhost:2000"
echo ""
echo "Press Ctrl+C to stop services or run: docker-compose down"

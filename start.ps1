Write-Host "🚀 Starting CodeForge IDE..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Start services
Write-Host "📦 Starting services with Docker Compose..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "✅ CodeForge IDE is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔌 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "⚙️  Piston:   http://localhost:2000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop or run: docker-compose down" -ForegroundColor Yellow
Read-Host "Press Enter to exit"

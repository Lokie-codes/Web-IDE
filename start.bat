@echo off
echo  Starting CodeForge IDE...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo  Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Start services
echo  Starting services with Docker Compose...
docker-compose up -d

echo.
echo  Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo  CodeForge IDE is ready!
echo.
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:3001
echo  Piston:   http://localhost:2000
echo.
echo Press Ctrl+C to stop or run: docker-compose down
pause

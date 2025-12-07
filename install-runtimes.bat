@echo off
echo Installing Piston runtimes...
echo.

echo Installing Node.js...
curl -X POST http://localhost:2000/api/v2/packages -H "Content-Type: application/json" -d "{\"language\":\"node\",\"version\":\"18.15.0\"}"
timeout /t 2 /nobreak >nul

echo.
echo Installing Python...
curl -X POST http://localhost:2000/api/v2/packages -H "Content-Type: application/json" -d "{\"language\":\"python\",\"version\":\"3.10.0\"}"
timeout /t 2 /nobreak >nul

echo.
echo Installing Java...
curl -X POST http://localhost:2000/api/v2/packages -H "Content-Type: application/json" -d "{\"language\":\"java\",\"version\":\"15.0.2\"}"
timeout /t 2 /nobreak >nul

echo.
echo Installing GCC (C/C++)...
curl -X POST http://localhost:2000/api/v2/packages -H "Content-Type: application/json" -d "{\"language\":\"gcc\",\"version\":\"10.2.0\"}"
timeout /t 2 /nobreak >nul

echo.
echo Installation complete!
echo Checking installed runtimes...
curl http://localhost:2000/api/v2/runtimes
pause

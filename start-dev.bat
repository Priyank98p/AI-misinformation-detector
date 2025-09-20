@echo off
echo Starting AI Misinformation Detector...
echo.
echo Make sure you have set up your .env file with GOOGLE_API_KEY
echo.
echo Starting both frontend and backend servers...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:3001
echo.
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start cmd /k "cd frontend && npm run dev"
echo.
echo Both servers are starting up...
echo Check the terminal windows for any errors.
pause

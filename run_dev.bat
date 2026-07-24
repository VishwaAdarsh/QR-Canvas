@echo off
title QR Canvas Studio Launcher
cls
echo ========================================================
echo               ✨ QR Canvas Studio Launcher
echo ========================================================
echo.

echo Starting FastAPI Backend Server on port 8000...
start "QR Canvas FastAPI Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --port 8000"

echo Starting React Vite Frontend Studio on port 5173...
start "QR Canvas React Studio" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening QR Canvas Studio in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo   QR Canvas is now live!
echo   Frontend Web App : http://localhost:5173
echo   FastAPI API Specs: http://localhost:8000/docs
echo ========================================================
echo.
pause

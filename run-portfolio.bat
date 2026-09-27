@echo off
setlocal
title TMRW UNLIMIT Portfolio Server

:: Ensure Node.js is in PATH
where npm >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\nodejs\npm.cmd" (
        set "PATH=C:\Program Files\nodejs;%PATH%"
    ) else (
        echo [ERROR] Node.js is not found. Please install Node.js from https://nodejs.org/
        pause
        exit /b 1
    )
)

echo ===================================================
echo   Starting TMRW UNLIMIT Portfolio Development Server
echo ===================================================
echo.

:: Check node_modules
if not exist "node_modules\" (
    echo [INFO] Installing dependencies (first time setup)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo.
echo [INFO] Starting Vite development server...
echo [INFO] Local URL: http://localhost:5173/portfolio-website-naja/
echo.
npm run dev
pause
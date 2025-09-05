@echo off
echo ========================================
echo  MAXXRAT Web Panel - Vercel Deployment
echo ========================================
echo.

echo Checking if Vercel CLI is installed...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
    echo.
)

echo.
echo Starting Vercel deployment...
echo Current directory: %cd%
echo.

vercel --prod

echo.
echo ========================================
echo Deployment complete!
echo Check your Vercel dashboard for the live URL
echo ========================================
pause

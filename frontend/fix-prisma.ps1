# fix-prisma.ps1
# This script helps fix Prisma errors on Windows by ensuring the server is stopped and the client is correctly generated.

Write-Host "--- RuralEdu Prisma Fix Tool ---" -ForegroundColor Cyan

# Check if npm run dev is likely running (Next.js typically runs on node.exe)
$nextProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next-dev*" -or $_.CommandLine -like "*next dev*" }

if ($nextProcess) {
    Write-Host "[!] Warning: It looks like a Next.js development server is running." -ForegroundColor Yellow
    Write-Host "[!] Please STOP the server (Ctrl+C in the terminal) before proceeding." -ForegroundColor Yellow
    Write-Host "[!] This avoids 'EPERM' errors caused by file locking." -ForegroundColor Yellow
    
    $choice = Read-Host "Do you want to continue anyway? (y/N)"
    if ($choice -ne "y") {
        Write-Host "Aborted. Please stop the server and run this again." -ForegroundColor Red
        exit
    }
}

Write-Host "[1/3] Clearing Prisma Client cache..." -ForegroundColor Green
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Recurse -Force "node_modules\.prisma"
}

Write-Host "[2/3] Generating Prisma Client..." -ForegroundColor Green
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] Prisma Generation Failed! Check the error above." -ForegroundColor Red
    exit 1
}

Write-Host "[3/3] Syncing database schema..." -ForegroundColor Green
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] DB Push might have failed. Ensure your PostgreSQL is running and .env is correct." -ForegroundColor Yellow
}

Write-Host "`n[SUCCESS] Prisma has been fixed!" -ForegroundColor Green
Write-Host "You can now restart your server with: npm run dev" -ForegroundColor Cyan

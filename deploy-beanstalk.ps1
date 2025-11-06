# Deploy to Elastic Beanstalk

# Navigate to backend folder
cd C:\Ironlog\amplify\backend

# Create ZIP file
$zipName = "backend-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
Write-Host "Creating ZIP file: $zipName" -ForegroundColor Green

# Add files to ZIP
$files = @(
    "server.js",
    "package.json",
    ".env",
    "controllers",
    "models",
    "routes",
    "middleware"
)

# Remove old ZIPs if they exist (keep last 3)
Get-ChildItem backend-*.zip -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -Skip 3 | Remove-Item -Force

# Create new ZIP
Compress-Archive -Path $files -DestinationPath $zipName -Force

Write-Host "✅ ZIP created: $zipName" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to AWS Elastic Beanstalk Console"
Write-Host "2. Click 'Upload and Deploy'"
Write-Host "3. Upload: $zipName"
Write-Host "4. Version label: v2"
Write-Host "5. Click Deploy"
Write-Host ""
Write-Host "ZIP file location: $(Get-Location)\$zipName" -ForegroundColor Cyan

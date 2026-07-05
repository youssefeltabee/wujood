param(
  [string]$NodeEnv = "development"
)

Write-Host "Wujood Setup Script" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
& npm install
if ($LASTEXITCODE -ne 0) {
  Write-Host "npm install failed" -ForegroundColor Red
  exit 1
}

Write-Host "Step 2: Generating Prisma client..." -ForegroundColor Yellow
& npx prisma generate
if ($LASTEXITCODE -ne 0) {
  Write-Host "Prisma generate failed" -ForegroundColor Red
  exit 1
}

Write-Host "Step 3: Pushing database schema..." -ForegroundColor Yellow
Write-Host "   Make sure PostgreSQL is running and DATABASE_URL is set in .env" -ForegroundColor Gray
& npx prisma db push
if ($LASTEXITCODE -ne 0) {
  Write-Host "Database push failed. Check your DATABASE_URL in .env" -ForegroundColor Red
  exit 1
}

Write-Host "Step 4: Seeding templates..." -ForegroundColor Yellow
& npx prisma db seed
if ($LASTEXITCODE -ne 0) {
  Write-Host "Seed failed, but you can run 'npx prisma db seed' later" -ForegroundColor Red
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the development server" -ForegroundColor Cyan
Write-Host "Visit http://localhost:3000 to see your Wujood app" -ForegroundColor Cyan

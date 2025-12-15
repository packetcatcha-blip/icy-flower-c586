# Automated Deployment Script
# Deploys to dev, tests, then auto-deploys to production if tests pass

param(
    [switch]$SkipTests = $false
)

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 Automated Deployment Pipeline`n" -ForegroundColor Cyan

# Step 1: Deploy to Dev
Write-Host "📦 Step 1: Deploying to Dev Environment..." -ForegroundColor Yellow
npx wrangler deploy --env dev
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Dev deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dev deployment successful!`n" -ForegroundColor Green

# Step 2: Test Dev Environment
if (-not $SkipTests) {
    Write-Host "🧪 Step 2: Testing Dev Environment..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5  # Wait for deployment to propagate
    
    & ".\scripts\test-all-links.ps1" -BaseUrl "https://sellerso-dev.jsellers.workers.dev"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ Dev tests failed! Aborting production deployment." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ All dev tests passed!`n" -ForegroundColor Green
} else {
    Write-Host "⊘ Skipping tests (--SkipTests flag set)`n" -ForegroundColor Yellow
}

# Step 3: Auto-Deploy to Production
Write-Host "🌐 Step 3: Auto-Deploying to Production..." -ForegroundColor Yellow
npx wrangler deploy --env production

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Production deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Production deployment successful!`n" -ForegroundColor Green

# Step 4: Test Production Environment
if (-not $SkipTests) {
    Write-Host "🔍 Step 4: Testing Production Environment..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5  # Wait for deployment to propagate
    
    & ".\scripts\test-all-links.ps1" -BaseUrl "https://sellersco.net"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n⚠️  Production tests failed! Consider rollback." -ForegroundColor Yellow
        Write-Host "Rollback command: npx wrangler rollback --env production`n" -ForegroundColor Gray
        exit 1
    }
    Write-Host "✅ All production tests passed!`n" -ForegroundColor Green
}

# Success Summary
Write-Host ("=" * 70) -ForegroundColor Green
Write-Host "`n✅ DEPLOYMENT COMPLETE!`n" -ForegroundColor Green
Write-Host "   Dev: https://sellerso-dev.jsellers.workers.dev" -ForegroundColor Cyan
Write-Host "   Production: https://sellersco.net" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor Green

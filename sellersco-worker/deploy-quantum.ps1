#!/usr/bin/env pwsh

# 🚀 QUANTUM FEATURE DEPLOYMENT QUICK-START
# Run this script to deploy the Post-Quantum Revolution feature
# 
# ⚠️  CRITICAL: Always test on staging worker first!
#     ./deploy-quantum.ps1 -WorkerName [YOUR-TEST-WORKER]  # Test first
#     ./deploy-quantum.ps1                                  # Production

param(
    [string]$WorkerName = "",  # Empty = deploy to production (icy-flower-c586)
    [switch]$Help
)

if ($Help) {
    Write-Host "
QUANTUM FEATURE DEPLOYMENT

Usage: 
  ./deploy-quantum.ps1                        # Deploy to production
  ./deploy-quantum.ps1 -WorkerName my-test   # Deploy to staging worker first
  ./deploy-quantum.ps1 -Help                  # Show this help

⚠️  ALWAYS test on staging (-WorkerName) before production!
" -ForegroundColor Cyan
    exit 0
}

Write-Host "
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  ⚛️  POST-QUANTUM REVOLUTION - Cloudflare Worker Deployment   ║
║                                                                ║
║  Ultra-Badass Interactive Quantum Cryptography Experience    ║
║                                                                ║
║  Production: icy-flower-c586.jsellers.workers.dev            ║
║  (DNS CNAME → sellersco.net)                                  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

if ($WorkerName) {
    Write-Host "📌 Deploying to STAGING worker: $WorkerName" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Deploying to PRODUCTION: icy-flower-c586" -ForegroundColor Red
    Write-Host "   (Make sure you tested on staging first!)" -ForegroundColor Yellow
    $confirm = Read-Host "Continue? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "Deployment cancelled" -ForegroundColor Gray
        exit 0
    }
}

# Check if wrangler is installed
if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "❌ wrangler CLI not found. Install with: npm install -g wrangler" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 STEP 1: Create Cloudflare Resources" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# D1 Database
Write-Host "`n▶ Creating D1 Database (quantum_sessions_db)..." -ForegroundColor Cyan
$d1Output = wrangler d1 create quantum_sessions_db 2>&1
if ($d1Output -match 'database_id.*:.*"([a-f0-9\-]+)"') {
    $d1Id = $matches[1]
    Write-Host "✅ D1 created: $d1Id" -ForegroundColor Green
    Write-Host "   📝 UPDATE wrangler.jsonc line ~90:" -ForegroundColor Yellow
    Write-Host "   ""database_id"": ""$d1Id""" -ForegroundColor Gray
} else {
    Write-Host "⚠️  D1 may already exist. Check: wrangler d1 list" -ForegroundColor Yellow
}

# Vectorize
Write-Host "`n▶ Creating Vectorize Index (quantum-docs-index)..." -ForegroundColor Cyan
$vectorOutput = wrangler vectorize create quantum-docs-index --dimension=768 2>&1
if ($vectorOutput -match "✓" -or $vectorOutput -match "created") {
    Write-Host "✅ Vectorize index created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Vectorize may already exist" -ForegroundColor Yellow
}

# KV Namespace
Write-Host "`n▶ Creating KV Namespace (QUANTUM_KV)..." -ForegroundColor Cyan
$kvOutput = wrangler kv:namespace create QUANTUM_KV 2>&1
if ($kvOutput -match 'id\s*=\s*"([a-f0-9]+)"') {
    $kvId = $matches[1]
    Write-Host "✅ KV created: $kvId" -ForegroundColor Green
    Write-Host "   📝 UPDATE wrangler.jsonc line ~130:" -ForegroundColor Yellow
    Write-Host "   ""id"": ""$kvId""" -ForegroundColor Gray
}

$kvPreviewOutput = wrangler kv:namespace create QUANTUM_KV --preview 2>&1
if ($kvPreviewOutput -match 'id\s*=\s*"([a-f0-9]+)"') {
    $kvPreviewId = $matches[1]
    Write-Host "   📝 UPDATE wrangler.jsonc line ~131:" -ForegroundColor Yellow
    Write-Host "   ""preview_id"": ""$kvPreviewId""" -ForegroundColor Gray
}

# Queues
Write-Host "`n▶ Creating Queue (quantum-sims)..." -ForegroundColor Cyan
wrangler queues create quantum-sims 2>&1 | Out-Null
Write-Host "✅ Queue created" -ForegroundColor Green

Write-Host "`n📋 STEP 2: Update wrangler.jsonc" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "
🔧 You MUST update these fields in wrangler.jsonc:

Line ~90:   ""database_id"": ""$d1Id"" 
Line ~130:  ""id"": ""$kvId""
Line ~131:  ""preview_id"": ""$kvPreviewId""

Then save and continue!
" -ForegroundColor Yellow

$response = Read-Host "`n✅ Have you updated wrangler.jsonc? (yes/no)"
if ($response -ne "yes") {
    Write-Host "❌ Please update wrangler.jsonc and run again" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 STEP 3: Initialize D1 Schema" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if (Test-Path "sql\quantum-schema.sql") {
    Write-Host "`n▶ Initializing D1 database schema..." -ForegroundColor Cyan
    wrangler d1 execute quantum_sessions_db --file=sql/quantum-schema.sql 2>&1 | Select-Object -Last 5
    Write-Host "✅ D1 schema initialized" -ForegroundColor Green
} else {
    Write-Host "⚠️  sql/quantum-schema.sql not found" -ForegroundColor Yellow
}

Write-Host "`n📋 STEP 4: Deploy to Cloudflare" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`n▶ Deploying worker..." -ForegroundColor Cyan
if ($WorkerName) {
    wrangler deploy --name $WorkerName
} else {
    wrangler deploy
}
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Deployment failed. Check logs with: wrangler tail" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 STEP 5: Test Quantum Routes" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($WorkerName) {
    $domain = "$WorkerName.jsellers.workers.dev"
    Write-Host "`n Testing on staging: https://$domain" -ForegroundColor Yellow
} else {
    $domain = "icy-flower-c586.jsellers.workers.dev"
    Write-Host "`n Testing on production: https://$domain" -ForegroundColor Cyan
}

Write-Host "`n▶ Testing /quantum (hero page)..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "https://$domain/quantum" -TimeoutSec 10 -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) {
    Write-Host "✅ Hero page loads" -ForegroundColor Green
} else {
    Write-Host "⚠️  Hero page check: $($response.StatusCode)" -ForegroundColor Yellow
}

Write-Host "`n▶ Testing /quantum/threats..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "https://$domain/quantum/threats" -TimeoutSec 10 -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) {
    Write-Host "✅ Threats page loads" -ForegroundColor Green
}

Write-Host "`n▶ Testing /quantum/solutions..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "https://$domain/quantum/solutions" -TimeoutSec 10 -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) {
    Write-Host "✅ Solutions page loads" -ForegroundColor Green
}

Write-Host "`n▶ Testing /quantum/chat API..." -ForegroundColor Cyan
$chatResponse = Invoke-WebRequest -Uri "https://$domain/quantum/chat" -Method POST -Headers @{'Content-Type'='application/json'} -Body '{"query":"What is ML-KEM?"}' -TimeoutSec 15 -ErrorAction SilentlyContinue
if ($chatResponse.StatusCode -eq 200) {
    Write-Host "✅ Chat API responds" -ForegroundColor Green
    $data = $chatResponse.Content | ConvertFrom-Json
    Write-Host "   Response: $($data.response.substring(0, 80))..." -ForegroundColor Gray
} else {
    Write-Host "⚠️  Chat API check: $($chatResponse.StatusCode)" -ForegroundColor Yellow
}

Write-Host "`n
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🚀 DEPLOYMENT COMPLETE!                                     ║
║                                                                ║
║  Your quantum feature is now LIVE:                           ║
║                                                                ║
║  🌟 https://$domain/quantum                    ║
║  ⚠️  https://$domain/quantum/threats           ║
║  🛡️  https://$domain/quantum/solutions         ║
║  🎮 https://$domain/quantum/sims               ║
║  💬 https://$domain/quantum/chat               ║
║  🧪 https://$domain/quantum/quiz               ║
║                                                                ║
║  📚 Documentation:                                           ║
║     • QUANTUM-INTEGRATION.md - Complete guide               ║
║     • QUANTUM-SETUP.md - Advanced setup                     ║
║     • QUANTUM-FEATURE-README.md - Feature overview          ║
║                                                                ║
║  🔍 Monitor:                                                ║
║     wrangler tail --env production                          ║
║                                                                ║
║  📊 View Results:                                           ║
║     wrangler d1 execute quantum_sessions_db \               ║
║       --command ""SELECT * FROM quiz_results""              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

" -ForegroundColor Green

Write-Host "Next: Pre-index quantum docs to Vectorize for better RAG results" -ForegroundColor Yellow
Write-Host "See QUANTUM-SETUP.md for Vectorize indexing instructions" -ForegroundColor Gray

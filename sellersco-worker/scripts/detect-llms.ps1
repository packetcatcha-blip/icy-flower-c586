# LLM Detection and Configuration Script
# Automatically detects Ollama, LM Studio, and other local LLMs

Write-Host "🔍 Scanning for Local LLMs..." -ForegroundColor Cyan
Write-Host ""

# Check Ollama
Write-Host "Checking Ollama..." -ForegroundColor Yellow
$ollamaRunning = Get-Process | Where-Object { $_.ProcessName -match 'ollama' }
if ($ollamaRunning) {
    Write-Host "✅ Ollama is running (PID: $($ollamaRunning[0].Id))" -ForegroundColor Green
    
    try {
        $ollamaModels = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 5
        Write-Host "   Available models:" -ForegroundColor Cyan
        foreach ($model in $ollamaModels.models) {
            $size = [math]::Round($model.size / 1GB, 2)
            Write-Host "   - $($model.name) ($($model.details.parameter_size), $size GB)" -ForegroundColor White
        }
        Write-Host ""
    } catch {
        Write-Host "⚠️  Ollama running but API not responding" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Ollama not running" -ForegroundColor Red
    Write-Host "   Start with: ollama serve" -ForegroundColor Gray
    Write-Host ""
}

# Check LM Studio
Write-Host "Checking LM Studio..." -ForegroundColor Yellow
try {
    $lmStudioModels = Invoke-RestMethod -Uri "http://localhost:1234/v1/models" -Method Get -TimeoutSec 5
    Write-Host "✅ LM Studio server is running" -ForegroundColor Green
    Write-Host "   Available models:" -ForegroundColor Cyan
    foreach ($model in $lmStudioModels.data) {
        Write-Host "   - $($model.id)" -ForegroundColor White
    }
    Write-Host ""
} catch {
    Write-Host "❌ LM Studio not running on port 1234" -ForegroundColor Red
    Write-Host "   Start LM Studio and enable local server" -ForegroundColor Gray
    Write-Host ""
}

# Check for Continue extension
Write-Host "Checking Continue extension configuration..." -ForegroundColor Yellow
$continueConfigPath = Join-Path $PSScriptRoot "..\\.continue\config.json"
if (Test-Path $continueConfigPath) {
    Write-Host "✅ Continue config found: $continueConfigPath" -ForegroundColor Green
    
    $config = Get-Content $continueConfigPath | ConvertFrom-Json
    Write-Host "   Configured models:" -ForegroundColor Cyan
    foreach ($model in $config.models) {
        Write-Host "   - $($model.title) ($($model.provider))" -ForegroundColor White
    }
    Write-Host ""
} else {
    Write-Host "⚠️  Continue config not found" -ForegroundColor Yellow
    Write-Host "   Expected at: $continueConfigPath" -ForegroundColor Gray
    Write-Host ""
}

# Generate updated config
Write-Host "Generating updated Continue configuration..." -ForegroundColor Yellow

$updatedModels = @()

# Add Ollama models
if ($ollamaRunning -and $ollamaModels) {
    foreach ($model in $ollamaModels.models) {
        $contextLength = 32768  # Default
        if ($model.name -match "llama3.1") {
            $contextLength = 128000
        }
        
        $updatedModels += @{
            title = "$($model.name) ($($model.details.parameter_size))"
            provider = "ollama"
            model = $model.name
            apiBase = "http://localhost:11434"
            contextLength = $contextLength
        }
    }
}

# Add LM Studio if available
if ($lmStudioModels) {
    foreach ($model in $lmStudioModels.data) {
        $updatedModels += @{
            title = "LM Studio: $($model.id)"
            provider = "lmstudio"
            model = $model.id
            apiBase = "http://localhost:1234/v1"
        }
    }
}

# Save configuration suggestion
$configSuggestion = @{
    models = $updatedModels
    detected_at = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
} | ConvertTo-Json -Depth 10

$outputPath = Join-Path $PSScriptRoot "detected-llms.json"
$configSuggestion | Out-File -FilePath $outputPath -Encoding utf8
Write-Host "✅ Configuration saved to: $outputPath" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   - Ollama: $(if ($ollamaRunning) { '✅ Running' } else { '❌ Not running' })" -ForegroundColor $(if ($ollamaRunning) { 'Green' } else { 'Red' })
Write-Host "   - LM Studio: $(if ($lmStudioModels) { '✅ Running' } else { '❌ Not running' })" -ForegroundColor $(if ($lmStudioModels) { 'Green' } else { 'Red' })
Write-Host "   - Total models detected: $($updatedModels.Count)" -ForegroundColor White
Write-Host ""

# Next steps
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Review detected configuration: $outputPath" -ForegroundColor White
Write-Host "   2. Merge with existing Continue config if desired" -ForegroundColor White
Write-Host "   3. Reload VS Code to apply changes: Ctrl+Shift+P → 'Reload Window'" -ForegroundColor White
Write-Host ""

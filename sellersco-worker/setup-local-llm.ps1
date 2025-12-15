# Local LLM Quick Setup Script
# Run this to set up Ollama and recommended models for VS Code development

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Local LLM Setup for VS Code" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is installed
Write-Host "Checking for Ollama..." -ForegroundColor Yellow
$ollamaInstalled = Get-Command ollama -ErrorAction SilentlyContinue

if (-not $ollamaInstalled) {
    Write-Host "❌ Ollama not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installing Ollama via winget..." -ForegroundColor Yellow
    
    try {
        winget install Ollama.Ollama
        Write-Host "✅ Ollama installed successfully" -ForegroundColor Green
        
        # Add to PATH for current session
        $env:Path += ";$env:LOCALAPPDATA\Programs\Ollama"
    }
    catch {
        Write-Host "❌ Failed to install Ollama automatically" -ForegroundColor Red
        Write-Host "Please install manually from: https://ollama.ai/download" -ForegroundColor Yellow
        exit 1
    }
}
else {
    Write-Host "✅ Ollama is installed" -ForegroundColor Green
}

# Check Ollama version
Write-Host ""
Write-Host "Ollama version:" -ForegroundColor Yellow
ollama --version

# Check if Ollama service is running
Write-Host ""
Write-Host "Checking Ollama service..." -ForegroundColor Yellow
$ollamaProcess = Get-Process ollama -ErrorAction SilentlyContinue

if (-not $ollamaProcess) {
    Write-Host "⚠️  Ollama service not running. Starting..." -ForegroundColor Yellow
    Start-Process ollama -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "✅ Ollama service started" -ForegroundColor Green
}
else {
    Write-Host "✅ Ollama service is running" -ForegroundColor Green
}

# Test Ollama API
Write-Host ""
Write-Host "Testing Ollama API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 5
    Write-Host "✅ Ollama API responding" -ForegroundColor Green
}
catch {
    Write-Host "❌ Ollama API not responding" -ForegroundColor Red
    Write-Host "Try restarting Ollama: ollama serve" -ForegroundColor Yellow
}

# List installed models
Write-Host ""
Write-Host "Checking installed models..." -ForegroundColor Yellow
$models = ollama list

# Install recommended models
$recommendedModels = @(
    @{ Name = "codellama:7b"; Description = "Code completion (fast, 4GB)" },
    @{ Name = "llama3.2:latest"; Description = "Chat/explanations (better reasoning, 2GB)" },
    @{ Name = "nomic-embed-text"; Description = "Embeddings for semantic search (274MB)" }
)

Write-Host ""
Write-Host "Recommended models for development:" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

foreach ($model in $recommendedModels) {
    Write-Host ""
    Write-Host "Model: $($model.Name)" -ForegroundColor Yellow
    Write-Host "Purpose: $($model.Description)" -ForegroundColor Gray
    
    # Check if model is installed
    if ($models -match $model.Name) {
        Write-Host "✅ Already installed" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Not installed" -ForegroundColor Red
        $install = Read-Host "Install $($model.Name)? (y/n)"
        
        if ($install -eq 'y') {
            Write-Host "Pulling $($model.Name)... (this may take several minutes)" -ForegroundColor Yellow
            ollama pull $model.Name
            Write-Host "✅ $($model.Name) installed" -ForegroundColor Green
        }
        else {
            Write-Host "⏭️  Skipped $($model.Name)" -ForegroundColor Gray
        }
    }
}

# Check Continue extension
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VS Code Extension Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking for Continue extension..." -ForegroundColor Yellow

$codeCmd = Get-Command code -ErrorAction SilentlyContinue
if ($codeCmd) {
    $extensions = code --list-extensions
    
    if ($extensions -match "continue") {
        Write-Host "✅ Continue extension is installed" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Continue extension not found" -ForegroundColor Red
        Write-Host "Installing Continue extension..." -ForegroundColor Yellow
        code --install-extension continue.continue
        Write-Host "✅ Continue extension installed" -ForegroundColor Green
    }
}
else {
    Write-Host "⚠️  VS Code command not found in PATH" -ForegroundColor Yellow
    Write-Host "Install Continue manually from VS Code Extensions marketplace" -ForegroundColor Gray
}

# Configuration summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration files created:" -ForegroundColor Yellow
Write-Host "  ✅ .continue/config.json - Continue extension settings" -ForegroundColor Green
Write-Host "  ✅ .vscode/settings.json - VS Code workspace settings" -ForegroundColor Green
Write-Host ""
Write-Host "Documentation available:" -ForegroundColor Yellow
Write-Host "  📄 LOCAL-LLM-SETUP.md - Complete setup guide" -ForegroundColor Gray
Write-Host "  📄 copilot-instructions.md - Development patterns" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart VS Code to load new configuration" -ForegroundColor White
Write-Host "2. Open Continue sidebar (Ctrl+Shift+P → 'Continue: Open')" -ForegroundColor White
Write-Host "3. Select 'Ollama (Local)' from model dropdown" -ForegroundColor White
Write-Host "4. Start coding with local AI assistance!" -ForegroundColor White
Write-Host ""
Write-Host "Commands:" -ForegroundColor Yellow
Write-Host "  ollama list         - List installed models" -ForegroundColor Gray
Write-Host "  ollama ps           - Show running models" -ForegroundColor Gray
Write-Host "  ollama run <model>  - Test a model interactively" -ForegroundColor Gray
Write-Host "  ollama stop <model> - Stop a running model" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""

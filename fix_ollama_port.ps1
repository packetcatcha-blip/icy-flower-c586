# fix_ollama_port.ps1 - Kills port conflict, restarts Ollama container
Write-Host "Fixing Ollama port 11434 conflict..."
$netstat = netstat -ano | Select-String ":11434"
if ($netstat) {
    $pid = ($netstat.Line -split '\s+')[-1]
    Write-Host "Killing PID $pid..."
    taskkill /PID $pid /F
    Start-Sleep -Seconds 2
}
docker rm -f ollama
docker run -d -p 11434:11434 --name ollama ollama/ollama
Start-Sleep -Seconds 10
$status = docker ps --filter "name=ollama" --format "{{.Status}}"
if ($status -like "*Up*") {
    Write-Host "Ollama fixed! Test: curl http://localhost:11434"
} else {
    Write-Host "Failed. Ensure Docker Desktop running, no native Ollama installed."
}
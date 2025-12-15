# Add Home Button to All HTML Pages
# This script adds a Home button to all HTML pages in the public directory

$publicDir = "c:\demo\nuke-demo\icy-flower-c586\sellersco-worker\public"
$htmlFiles = Get-ChildItem "$publicDir\*.html" -Exclude "index.html"

$homeButtonHTML = @'
<!-- Home Button -->
<a href="/" class="home-btn" style="position:fixed;top:20px;left:20px;background:linear-gradient(135deg,#0066cc,#52b2ff);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;z-index:1000;box-shadow:0 4px 12px rgba(0,102,204,0.4);transition:all 0.3s">
  🏠 Home
</a>
<style>
.home-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,102,204,0.6)}
</style>
'@

Write-Host "`n🏠 Adding Home Button to All Pages...`n" -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if Home button already exists
    if ($content -notmatch 'class="home-btn"') {
        # Insert after <body> tag
        $newContent = $content -replace '(<body[^>]*>)', "`$1`n$homeButtonHTML"
        
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "✓ Added Home button to: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "⊘ Home button already exists in: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Home button addition complete!" -ForegroundColor Green

# Comprehensive Post-Deployment Test Script
# Tests every public link on sellersco.net

param(
    [string]$BaseUrl = "https://sellersco.net",
    [switch]$Detailed
)

Write-Host "`n🔍 Comprehensive Site Test for $BaseUrl`n" -ForegroundColor Cyan

# All public and protected routes
$routes = @{
    "Public Routes" = @(
        @{ Path = "/"; Name = "Homepage" }
        @{ Path = "/attack-patterns"; Name = "Attack Patterns" }
    )
    "Protected Routes" = @(
        @{ Path = "/deal-negotiator"; Name = "Deal Negotiator"; ExpectedStatus = 401 }
        @{ Path = "/fusion-dash"; Name = "Fusion Dashboard"; ExpectedStatus = 401 }
        @{ Path = "/sales-portal"; Name = "Sales Portal"; ExpectedStatus = 401 }
        @{ Path = "/sase-compare"; Name = "SASE Compare"; ExpectedStatus = 401 }
        @{ Path = "/ztna-compare"; Name = "ZTNA Compare"; ExpectedStatus = 401 }
        @{ Path = "/sase-phase2"; Name = "SASE Phase 2"; ExpectedStatus = 401 }
        @{ Path = "/ztna-phase2"; Name = "ZTNA Phase 2"; ExpectedStatus = 401 }
        @{ Path = "/product-verticals"; Name = "Product Verticals"; ExpectedStatus = 401 }
        @{ Path = "/regulations"; Name = "Regulations"; ExpectedStatus = 401 }
        @{ Path = "/gartner-mq-live"; Name = "Gartner MQ Live"; ExpectedStatus = 401 }
        @{ Path = "/metrics-scorecard"; Name = "Metrics Scorecard"; ExpectedStatus = 401 }
    )
    "API Endpoints" = @(
        @{ Path = "/api/message"; Name = "API Message"; Type = "JSON" }
        @{ Path = "/api/random"; Name = "API Random"; Type = "JSON" }
        @{ Path = "/api/get-ticker"; Name = "API Ticker"; Type = "JSON" }
    )
    "Lab Pages (Planned)" = @(
        @{ Path = "/vuln-lab"; Name = "Vulnerability Lab"; ExpectedStatus = 404 }
        @{ Path = "/owasp-range"; Name = "OWASP Top 10 Range"; ExpectedStatus = 404 }
        @{ Path = "/traps-lab"; Name = "Security By Deception"; ExpectedStatus = 404 }
        @{ Path = "/stormcenter"; Name = "Storm Center"; ExpectedStatus = 404 }
        @{ Path = "/troubletoolbox"; Name = "Troubleshooting Toolbox"; ExpectedStatus = 404 }
        @{ Path = "/hybrid-warroom"; Name = "Hybrid Cloud War Room"; ExpectedStatus = 404 }
        @{ Path = "/ai-gateway-arena"; Name = "AI Gateway Arena"; ExpectedStatus = 404 }
        @{ Path = "/auth-fusion"; Name = "Auth-Fusion Hub"; ExpectedStatus = 404 }
        @{ Path = "/cloud-chaos"; Name = "Cloud-Chaos Simulator"; ExpectedStatus = 404 }
        @{ Path = "/dns-hunt"; Name = "DNS Hunt"; ExpectedStatus = 404 }
        @{ Path = "/zt-sim"; Name = "Zero Trust Simulator"; ExpectedStatus = 404 }
        @{ Path = "/attack-map"; Name = "Live Attack Map"; ExpectedStatus = 404 }
        @{ Path = "/hall-of-fame"; Name = "Hall of Fame"; ExpectedStatus = 404 }
        @{ Path = "/trace"; Name = "Multi-Colo Trace"; ExpectedStatus = 404 }
        @{ Path = "/post-quantum"; Name = "Post Quantum Lab"; ExpectedStatus = 404 }
        @{ Path = "/threat-modeler"; Name = "Threat Modeler"; ExpectedStatus = 404 }
        @{ Path = "/multicloud-sim"; Name = "Multi-Cloud Simulator"; ExpectedStatus = 404 }
    )
    "R2 Images" = @(
        @{ Path = "/images/mainpage.png"; Name = "Main Page Image"; Type = "Image" }
    )
}

$results = @{
    Passed = 0
    Failed = 0
    Total = 0
}

foreach ($category in $routes.Keys) {
    Write-Host "`n📁 $category" -ForegroundColor Yellow
    Write-Host ("=" * 70) -ForegroundColor Gray
    
    foreach ($route in $routes[$category]) {
        $results.Total++
        $url = "$BaseUrl$($route.Path)"
        $expectedStatus = if ($route.ExpectedStatus) { $route.ExpectedStatus } else { 200 }
        
        try {
            $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
            $actualStatus = $response.StatusCode
            
            if ($actualStatus -eq $expectedStatus) {
                Write-Host "  ✅ $($route.Name)" -ForegroundColor Green -NoNewline
                Write-Host " - Status: $actualStatus" -ForegroundColor White
                $results.Passed++
                
                if ($Detailed -and $route.Type -eq "JSON") {
                    try {
                        $json = $response.Content | ConvertFrom-Json
                        Write-Host "     📊 Data: $($json | ConvertTo-Json -Compress -Depth 1)" -ForegroundColor Cyan
                    } catch {}
                }
            } else {
                Write-Host "  ⚠️  $($route.Name)" -ForegroundColor Yellow -NoNewline
                Write-Host " - Expected: $expectedStatus, Got: $actualStatus" -ForegroundColor White
                $results.Failed++
            }
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            
            if ($statusCode -eq $expectedStatus) {
                Write-Host "  ✅ $($route.Name)" -ForegroundColor Green -NoNewline
                Write-Host " - Status: $statusCode (as expected)" -ForegroundColor White
                $results.Passed++
            } else {
                Write-Host "  ❌ $($route.Name)" -ForegroundColor Red -NoNewline
                Write-Host " - Expected: $expectedStatus, Got: $statusCode" -ForegroundColor White
                $results.Failed++
            }
        }
    }
}

# Summary
Write-Host "`n" -NoNewline
Write-Host ("=" * 70) -ForegroundColor Gray
Write-Host "`n📊 Test Summary" -ForegroundColor Cyan
Write-Host "   Total Tests: $($results.Total)" -ForegroundColor White
Write-Host "   ✅ Passed: $($results.Passed)" -ForegroundColor Green
Write-Host "   ❌ Failed: $($results.Failed)" -ForegroundColor $(if ($results.Failed -gt 0) { "Red" } else { "Green" })

$successRate = [math]::Round(($results.Passed / $results.Total) * 100, 2)
Write-Host "   Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })

Write-Host "`n✅ Test Complete!`n" -ForegroundColor Green

# Return exit code based on failures
if ($results.Failed -gt 0) {
    exit 1
} else {
    exit 0
}

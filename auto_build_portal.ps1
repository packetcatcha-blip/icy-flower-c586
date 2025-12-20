# auto_build_portal.ps1 - Chains setup, build, deploy
cd C:\demo\nuke-demo\icy-flower-c586\sellersco-portal
npm run dev # Local test
# If OK, deploy
wrangler pages deploy . --project-name sellersco-portal
Write-Host "Portal live! URL from Wrangler output. Manage in Cloudflare dashboard (browser)."
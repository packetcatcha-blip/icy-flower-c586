# Auto-Deployment Configuration

## Policy
**Once user accepts deployment, always proceed automatically without prompting**

## Rules
1. If dev environment tests pass → Auto-deploy to production
2. If tests show 100% success rate → Keep all changes
3. No confirmation prompts after initial acceptance
4. Always add Home button to all new pages
5. Always run comprehensive link tests post-deployment

## Test Requirements
- 100% success rate required for auto-deployment
- Test script: `.\scripts\test-all-links.ps1`
- Checks: Public routes, protected routes, API endpoints, images, planned lab pages
- Every page must have Home button in top-left corner

## Deployment Flow
```
Code Change
    ↓
Deploy to Dev (auto)
    ↓
Run Tests (auto)
    ↓
Tests Pass? ━━ No ━→ Stop & Report
    ↓ Yes
Deploy to Production (auto)
    ↓
Run Production Tests (auto)
    ↓
Report Results
```

## Navigation Requirements
- Every HTML page (except index.html) must have Home button
- Position: Fixed, top-left (20px, 20px)
- Style: Blue gradient, 🏠 Home icon
- No user should need browser back button
- All pages link back to /

## Implementation
This policy is configured in:
- `.github/copilot-instructions.md` - AI deployment instructions
- `.vscode/settings.json` - VS Code automation settings
- `wrangler.jsonc` - Cloudflare Workers config
- `scripts/deploy-auto.ps1` - Automated deployment script

# Nexum Security Lab - Production Deployment

**Live at:** https://sellersco.net | https://icy-flower-c586.jsellers.workers.dev

---

## 📋 Quick Navigation

### 🚀 Getting Started
- **[QUICK-START.md](./QUICK-START.md)** - Essential quick reference for testing & deployment
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment workflow & procedures
- **[PRODUCTION-DNS-SETUP.md](./PRODUCTION-DNS-SETUP.md)** - DNS configuration details

### 🧪 Testing & Validation
- **[TESTING.md](./TESTING.md)** - Comprehensive testing procedures & checklists
- **[test-links.ps1](./test-links.ps1)** - Automated Windows test script
- **[test-links.sh](./test-links.sh)** - Automated Linux/Mac test script

### ⚙️ Infrastructure & Configuration
- **[AI-INFRASTRUCTURE.md](./AI-INFRASTRUCTURE.md)** - Cloudflare AI setup & bindings
- **[WORKSPACE-CONFIGURATION.md](./WORKSPACE-CONFIGURATION.md)** - Local dev environment setup
- **[wrangler.jsonc](./wrangler.jsonc)** - Worker configuration file

### 📚 Advanced Topics
- **[TRACING-SETUP.md](./TRACING-SETUP.md)** - Observability & tracing configuration
- **[QUANTUM-SETUP.md](./QUANTUM-SETUP.md)** - Quantum cryptography features
- **[LOCAL-LLM-SETUP.md](./LOCAL-LLM-SETUP.md)** - Local LLM development setup

### 📖 Documentation Index
- **[README-DOCUMENTATION-INDEX.md](./README-DOCUMENTATION-INDEX.md)** - Complete file index

---

## 🌐 Production Configuration

### DNS Setup
```
sellersco.net (Public URL)
    ↓
CNAME → icy-flower-c586.jsellers.workers.dev (Cloudflare Workers)
    ↓
Cloudflare R2 Storage (Images)
Cloudflare AI (LLM/Embeddings)
```

### Deployment Path
```
c:\demo\nuke-demo\icy-flower-c586\sellersco-worker
    ↓ (npm run build / npx wrangler deploy)
    ↓
Cloudflare Workers (icy-flower-c586.jsellers.workers.dev)
    ↓
https://sellersco.net (Public users)
```

---

## 🚨 CRITICAL PRODUCTION RULES

### ⚠️ Rule #1: NEVER Test on Production
```
✅ DO THIS:
  1. Make changes locally
  2. Deploy to staging: npx wrangler deploy --env dev
  3. Test on: https://sellerso-dev.jsellers.workers.dev
  4. After tests pass → Deploy to production: npx wrangler deploy
  5. Test on: https://sellersco.net

❌ NEVER THIS:
  - Deploy directly to production without staging tests
  - Test on icy-flower-c586.jsellers.workers.dev before confirming on staging
  - Skip the test-links.ps1 script
```

### ⚠️ Rule #2: Always Backup Before Deploying
```bash
# Get current version ID
npx wrangler deployments list

# Save it for rollback if needed
# Example: 4b5a62d2-f37e-4007-8e3d-d64ab10c671c

# Optional: Backup current HTML
curl https://sellersco.net > backup-$(date +%Y%m%d-%H%M%S).html
```

### ⚠️ Rule #3: Test Both URLs After Deployment
```bash
# Test production worker
curl https://icy-flower-c586.jsellers.workers.dev/

# Test public domain
curl https://sellersco.net/

# Both should return identical content
```

---

## 🚀 Standard Deployment Workflow

### Step 1: Make Changes Locally
```bash
cd c:\demo\nuke-demo\icy-flower-c586\sellersco-worker

# Edit files in:
# - public/index.html (static pages)
# - src/index.js (routing logic)
# - src/*-module.js (feature modules)
```

### Step 2: Deploy to Staging
```bash
npx wrangler deploy --env dev
```

### Step 3: Test on Staging
```powershell
# Windows
.\test-links.ps1 -Environment dev

# Linux/Mac
./test-links.sh dev
```

### Step 4: Verify Test Results
Expected: **37/37 tests passing (100%)**

### Step 5: Deploy to Production
```bash
npx wrangler deploy
```

### Step 6: Verify Production
```powershell
# Windows
.\test-links.ps1 -Environment production

# Linux/Mac
./test-links.sh production
```

### Step 7: Test Both URLs
```bash
curl https://sellersco.net/
curl https://icy-flower-c586.jsellers.workers.dev/
```

---

## 📊 Current Status

### ✅ Live Routes (18+ public routes)

| Route | Feature | Status |
|-------|---------|--------|
| `/` | Homepage | ✅ Live |
| `/post-quantum` | Quantum Crypto Lab | ✅ Live |
| `/attack-patterns` | Attack Pattern Analysis | ✅ Live |
| `/attack-map` | Live Threat Map (OTX + RSS) | ✅ Live |
| `/sales-portal` | Vendor Intelligence (80+ partners) | ✅ Live |
| `/regulations` | Compliance Frameworks (11 standards) | ✅ Live |
| `/sase-compare` | SASE Vendor Comparison | ✅ Live |
| `/ztna-compare` | ZTNA Feature Matrix | ✅ Live |
| `/gartner-mq-live` | Gartner Magic Quadrant | ✅ Live |
| `/deal-negotiator` | ROI/Pricing Calculator | ✅ Live |
| `/fusion-dash` | Security Dashboard | ✅ Live |

### 📦 Infrastructure

| Component | Status | Details |
|-----------|--------|---------|
| **Worker** | ✅ Active | icy-flower-c586.jsellers.workers.dev |
| **DNS** | ✅ Active | sellersco.net → CNAME |
| **R2 Storage** | ✅ Active | sellersco bucket for images |
| **AI Service** | ✅ Active | Cloudflare AI models available |
| **SSL/TLS** | ✅ Active | Auto-renewing via Cloudflare |

---

## 🔧 Common Tasks

### Deploy Changes to Production
```bash
npx wrangler deploy
```

### Check Deployment Status
```bash
npx wrangler deployments list
```

### Watch Live Logs
```bash
npx wrangler tail
```

### Rollback if Issues Found
```bash
# Get version ID
npx wrangler deployments list

# Rollback
npx wrangler rollback [version-id]
```

### Test Specific Route
```bash
curl https://sellersco.net/api/frameworks
curl https://sellersco.net/regulations
```

### Clear Browser Cache for Testing
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or test in incognito/private mode

---

## 🎯 Frontend Features

### Compliance Frameworks Dashboard
- 11 compliance standards (HIPAA, PCI, GDPR, CMMC, NIS2, DORA, SEC, ISO 27001)
- Real-time implementation tracking
- Partner alignment matrix

### Sales Portal Intelligence
- 80+ vendor profiles
- Objection handling library
- Win rate analytics
- ROI calculators

### Live Threat Intelligence
- OTX API integration
- 6 RSS threat feeds
- Geolocation visualization
- Real-time attack simulation

### Quantum Cryptography Lab
- Interactive 3D visualization
- NIST algorithm explanations
- Post-quantum migration guidance

---

## 🔒 Security & Authentication

### Public Routes
- Anyone can access
- No authentication required

### Protected Routes
- Require `@nexuminc.com` email
- Token stored in localStorage
- Session expires after 24 hours
- Example protected routes:
  - `/sales-portal`
  - `/regulations`
  - `/sase-compare`
  - `/ztna-compare`

---

## 📱 Responsive Design

- ✅ Mobile optimized
- ✅ Tablet responsive
- ✅ Desktop enhanced
- ✅ Dark theme (Nexum Blue)
- ✅ Fast performance (<200ms)

---

## 🔄 Update Process

### Adding New Features
1. Create new module file: `src/new-feature.js`
2. Export handler function: `export async function handleNewFeature(...)`
3. Add route in `src/index.js`: `if (pathname === '/new-feature') { return handleNewFeature(...) }`
4. Test locally: `npm run dev`
5. Deploy to staging: `npx wrangler deploy --env dev`
6. Test: `.\test-links.ps1 -Environment dev`
7. Deploy to production: `npx wrangler deploy`

### Updating Static Pages
1. Edit `public/index.html`
2. Test locally: `npm run dev`
3. Deploy to staging: `npx wrangler deploy --env dev`
4. Test on: https://sellerso-dev.jsellers.workers.dev
5. Deploy to production: `npx wrangler deploy`

### Adding New Images
1. Upload to Cloudflare R2 (`sellersco` bucket)
   ```bash
   npx wrangler r2 object put sellersco/image-name.png --file=./path/to/image.png
   ```
2. Reference in HTML/code: `/images/image-name.png`
3. Deploy updates: `npx wrangler deploy`

---

## 🆘 Troubleshooting

### Changes Don't Appear on sellersco.net
1. Verify deployment: `npx wrangler deployments list` (look for "Deployed" status)
2. Check DNS: `nslookup sellersco.net`
3. Clear browser cache: Hard refresh or incognito mode
4. Test both URLs: 
   ```bash
   curl https://sellersco.net/
   curl https://icy-flower-c586.jsellers.workers.dev/
   ```

### Worker Errors
1. Check logs: `npx wrangler tail`
2. Review recent deployments: `npx wrangler deployments list`
3. Look for build errors in terminal output
4. Test locally: `npm run dev`

### DNS Issues
1. Windows: `ipconfig /flushdns` then `nslookup sellersco.net`
2. Mac: `sudo dscacheutil -flushcache` then `nslookup sellersco.net`
3. Check Cloudflare Dashboard for DNS record status
4. Verify CNAME is "Proxied" (not "DNS only")

### Failed Tests
1. Run tests on staging first: `.\test-links.ps1 -Environment dev`
2. Review test output for specific failures
3. Check if protected routes require authentication
4. Verify API endpoints are returning correct response format

---

## 📚 Documentation Files

### Essential
- [QUICK-START.md](./QUICK-START.md) - Start here
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [TESTING.md](./TESTING.md) - Testing checklist
- [PRODUCTION-DNS-SETUP.md](./PRODUCTION-DNS-SETUP.md) - DNS configuration

### Infrastructure
- [AI-INFRASTRUCTURE.md](./AI-INFRASTRUCTURE.md) - AI services setup
- [WORKSPACE-CONFIGURATION.md](./WORKSPACE-CONFIGURATION.md) - Dev environment
- [wrangler.jsonc](./wrangler.jsonc) - Worker config

### Advanced
- [TRACING-SETUP.md](./TRACING-SETUP.md) - Observability
- [QUANTUM-SETUP.md](./QUANTUM-SETUP.md) - Quantum features
- [LOCAL-LLM-SETUP.md](./LOCAL-LLM-SETUP.md) - Local LLM

### Reference
- [README-DOCUMENTATION-INDEX.md](./README-DOCUMENTATION-INDEX.md) - Full index
- [API-ENDPOINTS-FIX.md](./API-ENDPOINTS-FIX.md) - API reference
- [FEATURE-AUDIT-MATRIX.md](./FEATURE-AUDIT-MATRIX.md) - Feature status

---

## 🤝 Support

### Quick Help
- See [QUICK-START.md](./QUICK-START.md)
- See [TESTING.md](./TESTING.md) for test troubleshooting

### Deployment Help
- See [DEPLOYMENT.md](./DEPLOYMENT.md)
- See [PRODUCTION-DNS-SETUP.md](./PRODUCTION-DNS-SETUP.md)

### Infrastructure Issues
- See [AI-INFRASTRUCTURE.md](./AI-INFRASTRUCTURE.md)
- Check logs: `npx wrangler tail`

---

## 📅 Version Information

- **Last Updated:** December 15, 2025
- **Status:** ✅ Production Ready
- **Worker:** icy-flower-c586
- **Public Domain:** sellersco.net
- **DNS Status:** ✅ Active (CNAME proxied)
- **Test Coverage:** 37+ automated tests
- **Live Routes:** 18+ public features

---

## 🎯 Footer Links (Production)

✅ **Updated December 15, 2025**
- Email: jsellers@nexuminc.com
- LinkedIn: https://www.linkedin.com/in/jim-sellers-5ba5606/
- Buy Me a Coffee: https://buymeacoffee.com/sellersco (gold hover)
- Nexum MSS: https://www.nexuminc.com/services/managed-security-services/ (cyan hover)

All links verified and live on https://sellersco.net

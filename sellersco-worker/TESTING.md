# 🚀 Pre-Production Testing Guide

## 🚨 MANDATORY TESTING WORKFLOW

**NEVER DEPLOY DIRECTLY TO PRODUCTION!**

You MUST follow this exact sequence:

```
Step 1: Test Locally
   npx wrangler dev
   └─ Test all features on http://localhost:8787

Step 2: Deploy to Dev/Staging Worker  
   npx wrangler deploy --name my-test-worker
   └─ Test all features on https://my-test-worker.jsellers.workers.dev
   └─ Run full test suite ✅ MUST PASS

Step 3: ONLY After All Tests Pass → Deploy to Production
   npx wrangler deploy
   └─ Deploys to: icy-flower-c586.jsellers.workers.dev (sellersco.net)
   └─ LIVE ON INTERNET - NO SECOND CHANCE
```

**PRODUCTION WORKER**: `icy-flower-c586.jsellers.workers.dev` → `sellersco.net` (DNS CNAME)  
**STATUS**: 🔴 LIVE - PRODUCTION ONLY - NO TESTING

---

## Overview
This document outlines all tests that MUST be completed BEFORE deploying to production at icy-flower-c586.jsellers.workers.dev (sellersco.net).

⚠️ **CRITICAL**: Test locally FIRST → test on separate/staging worker SECOND → only then deploy to production THIRD

---

## 🔗 Internal Link Testing

### Staging/Test Worker URL
Use this for testing: `https://[your-test-worker].jsellers.workers.dev`

### Homepage Navigation (/)
Test all navigation links from the main page:

**Public Navigation Links:**
- [ ] `/post-quantum` - Post Quantum Lab
- [ ] `/owasp-range` - OWASP Top 10 Range
- [ ] `/hybrid-warroom` - Hybrid Cloud War Room
- [ ] `/ai-gateway-arena` - AI Gateway Arena
- [ ] `/stormcenter` - Storm Center
- [ ] `/troubletoolbox` - Troubleshooting Toolbox
- [ ] `/traps-lab` - Security By Deception
- [ ] `/threat-modeler` - Threat Modeler
- [ ] `/multicloud-sim` - Multi-Cloud Simulator
- [ ] `/attack-patterns` - Attack Patterns (NOW WORKING ✅)
- [ ] `/attack-map` - Live Attack Map (with heatmap)

**Protected Navigation Links (requires @example.com auth):**
- [ ] `/sales-portal` - Sales Portal
- [ ] `/sase-compare` - SASE Comparison
- [ ] `/ztna-compare` - ZTNA Comparison
- [ ] `/sase-phase2` - SASE Phase 2
- [ ] `/ztna-phase2` - ZTNA Phase 2
- [ ] `/regulations` - Regulations Dashboard
- [ ] `/gartner-mq-live` - Gartner Magic Quadrant
- [ ] `/deal-negotiator` - Deal Negotiator
- [ ] `/metrics-scorecard` - Metrics Scorecard
- [ ] `/fusion-dash` - Fusion Dashboard

**Secondary Lab Links:**
- [ ] `/vuln-lab` - Vulnerability Lab
- [ ] `/auth-fusion` - Auth-Fusion Hub
- [ ] `/cloud-chaos` - Cloud-Chaos Simulator
- [ ] `/dns-hunt` - DNS Hunt
- [ ] `/zt-sim` - Zero Trust Simulator
- [ ] `/hall-of-fame` - Hall of Fame
- [ ] `/trace` - Multi-Colo Trace

**External Links:**
- [ ] `mailto:jsellers@example.com` - Email contact
- [ ] LinkedIn profile link

---

## 🧪 API Endpoint Testing

### Testing on Staging Worker FIRST
```bash
# Replace [YOUR-TEST-WORKER] with your staging worker name

# Test message endpoint
curl https://[YOUR-TEST-WORKER].jsellers.workers.dev/message
# Expected: "Hello, World!"

# Test random UUID
curl https://[YOUR-TEST-WORKER].jsellers.workers.dev/random
# Expected: UUID format (e.g., "a1b2c3d4-...")

# Test ticker endpoint
curl https://[YOUR-TEST-WORKER].jsellers.workers.dev/get-ticker
# Expected: JSON with CVE items
```

### Authentication Endpoints (Test First)
```bash
# Replace [YOUR-TEST-WORKER] with your staging worker name

# Test registration (requires @example.com email)
curl -X POST https://[YOUR-TEST-WORKER].jsellers.workers.dev/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
# Expected: {"success":true,"message":"Registration request submitted..."}

# Test login
curl -X POST https://[YOUR-TEST-WORKER].jsellers.workers.dev/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
# Expected: {"success":true,"token":"..."}

# Test protected route without auth
curl https://sellerso-dev.jsellers.workers.dev/sales-portal
# Expected: 401 Unauthorized

# Test protected route with auth
curl https://sellerso-dev.jsellers.workers.dev/sales-portal \
  -H "Authorization: Bearer valid-token-placeholder"
# Expected: 401 (needs proper implementation)
```

---

## 🖼️ R2 Image Testing

### Image Assets
Verify all images load correctly:

```bash
# Test logo
curl -I https://sellerso-dev.jsellers.workers.dev/images/sellerrco.png
# Expected: HTTP 200, Content-Type: image/png

# Test hero image
curl -I https://sellerso-dev.jsellers.workers.dev/images/mainpage.png
# Expected: HTTP 200, Content-Type: image/png

# Test additional images
curl -I https://sellerso-dev.jsellers.workers.dev/images/hacker.png
# Expected: HTTP 200
```

**Image Checklist:**
- [ ] Logo displays on homepage
- [ ] Hero image renders without distortion
- [ ] Images have proper caching headers (max-age=31536000)
- [ ] Images work on mobile breakpoints

---

## 🤖 AI Bindings Testing

### Vectorize Index (RAG)
```bash
# Create vectorize index (if not exists)
npx wrangler vectorize create security-knowledge-base \
  --dimensions=768 \
  --metric=cosine

# Verify index exists
npx wrangler vectorize list
```

### Workers AI Binding
Test AI model access in dev environment:
```javascript
// Test in worker code
const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
  messages: [{ role: 'user', content: 'What is SASE?' }]
});
```

### D1 Database Setup
```bash
# Create D1 database
npx wrangler d1 create security_lab_db

# Update wrangler.jsonc with returned database_id

# Create tables
npx wrangler d1 execute security_lab_db --file=./sql/schema.sql

# Verify tables
npx wrangler d1 execute security_lab_db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

---

## 📱 Responsive Design Testing

### Breakpoints
Test on multiple screen sizes:

**Desktop (1400px+)**
- [ ] Full navigation visible
- [ ] Hero image at 500px height
- [ ] About section displays properly
- [ ] Footer spans full width

**Tablet (768px - 1024px)**
- [ ] Hamburger menu appears
- [ ] Navigation collapses correctly
- [ ] Hero image at 400px height
- [ ] Cards stack appropriately

**Mobile (< 768px)**
- [ ] Navigation fully responsive
- [ ] Hero image at 300px height
- [ ] About buttons stack vertically
- [ ] Footer adjusts to column layout

**Small Mobile (< 480px)**
- [ ] Text sizes scale down
- [ ] Hero image at 250px height
- [ ] Touch targets are adequate (min 44px)

---

## 🎨 Browser Compatibility

Test on major browsers:

**Desktop:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Mobile:**
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Samsung Internet

---

## 🔒 Security Testing

### Authentication Flow
1. [ ] Registration requires @example.com email
2. [ ] Non-@example.com emails are rejected
3. [ ] Protected routes return 401 without token
4. [ ] Email approval workflow triggers (check jsellers@example.com inbox)
5. [ ] Approval links work correctly

### CORS & Headers
```bash
# Check security headers
curl -I https://sellerso-dev.jsellers.workers.dev/
# Look for: Content-Security-Policy, X-Frame-Options, etc.
```

---

## ⚡ Performance Testing

### Load Times
```bash
# Test page load performance
curl -w "@curl-format.txt" -o /dev/null -s https://sellerso-dev.jsellers.workers.dev/

# Create curl-format.txt with:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

**Performance Benchmarks:**
- [ ] Time to First Byte (TTFB) < 200ms
- [ ] Full page load < 2s
- [ ] Image loading uses proper caching
- [ ] No render-blocking resources

### Cloudflare Analytics
Check in dashboard:
- [ ] Worker requests/second
- [ ] CPU time per request
- [ ] Error rates
- [ ] Cache hit ratios

---

## 📊 Attack Patterns Page Testing

### Slide Navigation
- [ ] All 7 slides render correctly
- [ ] Previous/Next buttons work
- [ ] Keyboard arrows navigate (← →)
- [ ] Slide counter shows current/total
- [ ] First slide disables "Previous"
- [ ] Last slide disables "Next"

### Content Verification
- [ ] Vendor cards display properly
- [ ] Attack cards have correct styling
- [ ] Threat level bars render
- [ ] Statistics display correctly
- [ ] Mobile layout adapts

---

## 🚀 Pre-Production Checklist

Before running `npx wrangler deploy --env production`:

### 1. Backup Current Production
```bash
npx wrangler deployments list --env production
# Save the latest version ID
curl https://sellersco.net > backup-$(date +%Y%m%d-%H%M%S).html
```

### 2. Dev Testing Complete
- [ ] All internal links tested in dev
- [ ] All API endpoints verified
- [ ] Images load correctly
- [ ] Authentication works
- [ ] Mobile responsive verified
- [ ] No console errors in browser

### 3. Code Quality
- [ ] No hardcoded secrets in code
- [ ] Environment variables properly configured
- [ ] Error handling in place
- [ ] Logging for debugging available

### 4. Documentation Updated
- [ ] DEPLOYMENT.md reflects current process
- [ ] README.md updated with new features
- [ ] copilot-instructions.md includes AI bindings
- [ ] TESTING.md checklist completed

### 5. Monitoring Setup
- [ ] Cloudflare Analytics enabled
- [ ] Error tracking configured
- [ ] Performance baselines recorded

---

## 🔄 Rollback Procedure

If issues are found in production:

```bash
# List deployments to find previous stable version
npx wrangler deployments list --env production

# Rollback to specific version
npx wrangler rollback [version-id] --env production

# Verify rollback
curl -I https://sellersco.net/
```

---

## 📝 Test Results Log

### Test Date: _________________
### Tester: _________________
### Environment: [ ] Dev [ ] Production

**Overall Status:**
- [ ] All tests passed
- [ ] Minor issues found (documented below)
- [ ] Critical issues found (DO NOT DEPLOY)

**Issues Found:**
1. 
2. 
3. 

**Resolution:**
1. 
2. 
3. 

**Sign-off:** _________________
**Date:** _________________

---

## 🛠️ Automated Testing Script

Create `test-links.sh` for automated link checking:

```bash
#!/bin/bash
BASE_URL="https://sellerso-dev.jsellers.workers.dev"

echo "Testing public links..."
for path in /post-quantum /owasp-range /hybrid-warroom /ai-gateway-arena \
            /stormcenter /troubletoolbox /traps-lab /threat-modeler \
            /multicloud-sim /attack-patterns; do
  echo -n "Testing $path: "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
  echo "$STATUS"
done

echo "\nTesting protected links (should be 401)..."
for path in /sales-portal /sase-compare /ztna-compare; do
  echo -n "Testing $path: "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
  echo "$STATUS"
done

echo "\nTesting API endpoints..."
curl -s "$BASE_URL/message" | grep -q "Hello" && echo "✅ /message" || echo "❌ /message"
curl -s "$BASE_URL/get-ticker" | grep -q "CVE" && echo "✅ /get-ticker" || echo "❌ /get-ticker"

echo "\nTesting images..."
curl -s -I "$BASE_URL/images/sellerrco.png" | grep -q "200 OK" && echo "✅ Logo" || echo "❌ Logo"
curl -s -I "$BASE_URL/images/mainpage.png" | grep -q "200 OK" && echo "✅ Hero" || echo "❌ Hero"

echo "\nAll tests complete!"
```

Make executable: `chmod +x test-links.sh`

---

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Vectorize Documentation](https://developers.cloudflare.com/vectorize/)
- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [R2 Storage Docs](https://developers.cloudflare.com/r2/)

---

**Last Updated:** December 14, 2025
**Maintainer:** James Sellers (jsellers@example.com)

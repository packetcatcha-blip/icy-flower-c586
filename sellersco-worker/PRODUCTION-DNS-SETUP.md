# Production DNS Setup & Configuration

**Date:** December 15, 2025  
**Status:** ✅ **LIVE & ACTIVE**

---

## 🌐 Current Production Configuration

### DNS Record (Cloudflare)

| Field | Value |
|-------|-------|
| **Type** | CNAME |
| **Name** | sellersco.net |
| **Target** | icy-flower-c586.jsellers.workers.dev |
| **Proxy Status** | ✅ Proxied |
| **TTL** | Auto |
| **Status** | ✅ Active |

---

## 📋 What This Means

```
User visits: https://sellersco.net
    ↓
Cloudflare DNS resolves to:
    ↓
icy-flower-c586.jsellers.workers.dev
    ↓
Cloudflare Workers executes the worker code
    ↓
Returns public/index.html and routes requests to src/index.js
```

### Worker Details

| Configuration | Value |
|---|---|
| **Worker Name** | `icy-flower-c586` |
| **Worker URL** | https://icy-flower-c586.jsellers.workers.dev |
| **Public Domain** | https://sellersco.net |
| **Account ID** | `df60ef551fee860119d73fec244100db` |
| **R2 Bucket** | `sellersco` |
| **AI Binding** | ✅ Enabled |

---

## ⚙️ Bindings & Resources

### Current Bindings

```jsonc
// Cloudflare R2 Object Storage
"r2_buckets": [
  {
    "binding": "IMAGES",
    "bucket_name": "sellersco"
  }
]

// Cloudflare AI Service
"ai": {
  "binding": "AI"
}
```

### Available AI Models

Accessible via `env.AI` in worker code:

```javascript
// Chat completions
@cf/meta/llama-2-7b-chat-int8

// Text embeddings (for semantic search)
@cf/baai/bge-base-en-v1.5

// Translation
@cf/meta/m2m100-1.2b

// See more: https://developers.cloudflare.com/workers-ai/models/
```

### Static Assets

- **Location:** `public/` directory
- **Served from:** Cloudflare Workers Assets binding
- **Entry point:** `index.html` at `/`

### Dynamic Routes

- **Handler:** `src/index.js`
- **Special routes:**
  - `/post-quantum/*` → Quantum cryptography lab
  - `/attack-patterns` → Attack pattern visualization
  - `/sales-portal` → Vendor intelligence portal
  - `/regulations` → Compliance framework dashboard
  - `/api/*` → API endpoints

---

## 🔒 Security & Compliance

### What's Proxied

- ✅ All requests to sellersco.net
- ✅ Cloudflare DDoS protection enabled
- ✅ SSL/TLS certificate (automatic via Cloudflare)
- ✅ Rate limiting available (not yet configured)

### Authentication Status

- ⚠️ **Public routes:** Anyone can access
- 🔐 **Protected routes:** Require authentication
  - Email must end with `@nexuminc.com`
  - Token stored in localStorage
  - Session expires after 24 hours

---

## 🚀 Deployment Workflow

### For Production Deployments

**CRITICAL:** Always test on staging first!

```bash
# Step 1: Deploy to staging/dev worker
npx wrangler deploy --env dev

# Step 2: Test on https://sellerso-dev.jsellers.workers.dev
curl https://sellerso-dev.jsellers.workers.dev/

# Step 3: After verification, deploy to production
npx wrangler deploy

# Step 4: Verify production
curl https://sellersco.net/
curl https://icy-flower-c586.jsellers.workers.dev/
```

### After Deploying

- DNS propagation: ~1-2 minutes
- Changes appear on https://sellersco.net automatically
- Both URLs are identical (DNS CNAME points them to same worker)

---

## 📊 Current Deployment Status

### Latest Deployment

```
Version ID: [Check with: npx wrangler deployments list]
Status: ✅ Active
Deployed: December 15, 2025
Routes: 18+ functional public routes + protected routes
```

### Check Production Status

```bash
# List recent deployments
npx wrangler deployments list

# Check specific environment
npx wrangler deployments list --env production

# Get current worker status
curl https://sellersco.net/
curl https://icy-flower-c586.jsellers.workers.dev/

# Verify DNS resolution
nslookup sellersco.net
ping sellersco.net
```

---

## 🔄 Maintenance & Troubleshooting

### If Changes Don't Appear on sellersco.net

1. **Verify deployment succeeded:**
   ```bash
   npx wrangler deployments list
   # Look for recent "Deployed" status (green checkmark)
   ```

2. **Check DNS resolution:**
   ```bash
   nslookup sellersco.net
   # Should resolve to icy-flower-c586.jsellers.workers.dev
   ```

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or test in incognito mode

4. **Test both URLs:**
   ```bash
   curl https://sellersco.net/
   curl https://icy-flower-c586.jsellers.workers.dev/
   # Both should return identical content
   ```

### If DNS Isn't Resolving

1. **Check Cloudflare Dashboard:**
   - Go to https://dash.cloudflare.com/
   - Select domain: `sellersco.net`
   - Navigate to: **DNS** section
   - Verify CNAME record exists and is **Proxied**

2. **Verify in Windows:**
   ```powershell
   ipconfig /flushdns
   nslookup sellersco.net
   ```

3. **Verify in Linux/Mac:**
   ```bash
   sudo dscacheutil -flushcache
   nslookup sellersco.net
   ```

### If Worker Isn't Responding

1. **Check worker status:**
   ```bash
   npx wrangler tail
   # Monitor live logs from the worker
   ```

2. **Check for deployment errors:**
   ```bash
   npx wrangler deployments list
   # Look for failed deployments
   ```

3. **Rollback if needed:**
   ```bash
   # Get previous version ID
   npx wrangler deployments list
   
   # Rollback to previous version
   npx wrangler rollback [version-id]
   ```

---

## 📝 Important Notes

### DNS CNAME Points to Worker Subdomain
- sellersco.net → icy-flower-c586.jsellers.workers.dev
- **This is correct** for Cloudflare Workers + custom domain
- Users see sellersco.net in URL, but worker subdomain handles it

### Both URLs Are Identical
```
https://sellersco.net/          ← Public-facing URL
https://icy-flower-c586.jsellers.workers.dev/  ← Actual worker
```
Both point to the **same worker instance** with the same code.

### No Traditional Server
- No Linux VM, no containers
- Entirely serverless via Cloudflare Workers
- Code in `src/index.js` executes on every request
- Static assets from `public/` served automatically

### Scale & Performance
- Auto-scales with demand
- Deployed across Cloudflare edge network globally
- Response times: ~50-200ms depending on request complexity
- No cold starts for already-warm functions

---

## 🔧 Related Documentation

| File | Purpose |
|------|---------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Full deployment workflow & procedures |
| [QUICK-START.md](./QUICK-START.md) | Quick reference for testing & deployment |
| [TESTING.md](./TESTING.md) | Comprehensive testing checklist |
| [wrangler.jsonc](../wrangler.jsonc) | Worker configuration (see env.production) |

---

## 📞 Support & Questions

**To diagnose issues:**
1. Check logs: `npx wrangler tail`
2. Review recent deployments: `npx wrangler deployments list`
3. Test worker directly: `curl https://icy-flower-c586.jsellers.workers.dev/`
4. Test via sellersco.net: `curl https://sellersco.net/`

**To deploy changes:**
```bash
# After making changes
cd c:\demo\nuke-demo\icy-flower-c586\sellersco-worker

# Test on staging first
npx wrangler deploy --env dev
.\test-links.ps1 -Environment dev

# Then deploy to production
npx wrangler deploy
.\test-links.ps1 -Environment production
```

---

## 📅 Last Updated

**Date:** December 15, 2025  
**By:** GitHub Copilot  
**Status:** ✅ Production DNS verified and operational  
**Footer Links:** ✅ Buy Me a Coffee + Nexum MSS links deployed and visible

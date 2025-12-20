# IMPORTANT: Always run the test script (./test-links.sh or ./test-links.ps1) and analyze the output for failing routes, APIs, or images. Fix all issues before deploying. Always say yes to running the test script and analyzing failures before production deploy.
# Deployment Workflow

## 🚨 PRODUCTION ALERT

**`icy-flower-c586.jsellers.workers.dev` = PRODUCTION**
- 🌐 DNS CNAME → `sellersco.net` 
- 🔴 LIVE on the internet
- ⚡ Do NOT test on this worker
- 🔒 Only deploy after full staging validation

**📋 See [PRODUCTION-DNS-SETUP.md](./PRODUCTION-DNS-SETUP.md) for complete DNS configuration details**

---

## Quick Reference

### Testing/Staging Environment
```bash
# Deploy to a TEST worker (not production!)
npx wrangler deploy --name my-test-worker
```
**Use**: https://[your-test-worker].jsellers.workers.dev (for testing ONLY)

### Production Environment (sellersco.net)
```bash
# Deploy to PRODUCTION (icy-flower-c586 → sellersco.net)
npx wrangler deploy
```
**URL**: https://icy-flower-c586.jsellers.workers.dev (PRODUCTION - DNS CNAME to sellersco.net)

---

## ⚠️ CRITICAL RULES

**RULE #1**: Test on a separate worker first!  
**RULE #2**: Run full test suite on staging before production!  
**RULE #3**: NEVER test changes directly on icy-flower-c586.jsellers.workers.dev!  
**RULE #4**: Production deploys must be intentional - no accidents!

---

## Standard Workflow

### CRITICAL: Pre-Production Checklist

**📋 MANDATORY: Test on ANOTHER worker FIRST before touching icy-flower-c586.jsellers.workers.dev**

**📋 MANDATORY: Complete [TESTING.md](./TESTING.md) checklist before ANY production deployment.**

#### Step 1: Make Changes Locally
```bash
cd c:\demo\nuke-demo\icy-flower-c586\sellersco-worker
# Edit files in public/ or src/
```

#### Step 2: Test on Staging Worker
```bash
# Deploy to YOUR test worker (NOT production!)
npx wrangler deploy --name my-test-worker

# Test all links on staging
./test-links.ps1 -Environment staging

# Run unit tests
npm test

# Manual verification on https://my-test-worker.jsellers.workers.dev
curl https://my-test-worker.jsellers.workers.dev/
```

#### Step 3: Verify Test Results
- ✅ All public and lab routes load (200) with placeholder if not implemented
- ✅ API endpoints respond correctly
- ✅ R2 images load
- ✅ No console errors
- ✅ Responsive design works
- ✅ See [TESTING.md](./TESTING.md) for complete checklist

#### Step 4: Backup Production
```bash
# Get current production versions
npx wrangler deployments list

# Save version ID for rollback if needed
# Example: 4b5a62d2-f37e-4007-8e3d-d64ab10c671c

# Optional: Backup current production HTML
curl https://icy-flower-c586.jsellers.workers.dev > backup-prod-$(date +%Y%m%d-%H%M%S).html
curl https://sellersco.net > backup-sellersco-net-$(date +%Y%m%d-%H%M%S).html
```

#### Step 5: Deploy to Production (sellersco.net)
```bash
# ⚠️  THIS DEPLOYS TO PRODUCTION - icy-flower-c586.jsellers.workers.dev → sellersco.net

npx wrangler deploy
```

#### Step 6: Verify Production Deployment
```bash
# Test production is working
./test-links.ps1 -Environment production

# Test sellersco.net directly
curl https://sellersco.net/
curl https://icy-flower-c586.jsellers.workers.dev/

# Verify no errors
```

#### Step 7: If Rollback Needed
```bash
# Use version ID from Step 4
npx wrangler rollback [version-id]

# Test production restored
curl https://sellersco.net/
```

---

## AI Infrastructure Setup

### Workers AI Binding
The worker has access to Cloudflare's AI models via the `AI` binding.

**Test AI access (on staging first!):**
```javascript
// In src/index.js
const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
  messages: [{ role: 'user', content: 'Explain SASE security' }]
});
```

**Available models:**
- `@cf/meta/llama-2-7b-chat-int8` - Chat completion
- `@cf/baai/bge-base-en-v1.5` - Text embeddings (768 dimensions)
- `@cf/meta/m2m100-1.2b` - Translation
- See full list: https://developers.cloudflare.com/workers-ai/models/

### Vectorize Index (RAG/Semantic Search)

**Create the security-knowledge-base index:**
```bash
# Create index with 768 dimensions (matches bge-base-en-v1.5 embeddings)
npx wrangler vectorize create security-knowledge-base \
  --dimensions=768 \
  --metric=cosine
```

**Verify index exists:**
```bash
npx wrangler vectorize list
```

**Insert vectors (example):**
```javascript
// Generate embedding
const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
  text: 'SASE combines network security functions with WAN capabilities'
});

// Insert into Vectorize
await env.VECTORIZE_INDEX.insert([
  {
    id: 'sase-overview',
    values: embedding.data[0],
    metadata: { category: 'sase', source: 'training-data' }
  }
]);
```

**Query vectors (semantic search):**
```javascript
// Generate query embedding
const queryEmbedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
  text: 'What is secure access service edge?'
});

// Search similar vectors
const results = await env.VECTORIZE_INDEX.query(queryEmbedding.data[0], {
  topK: 5,
  returnMetadata: true
});
```


### D1 Database (User Authentication)

**Authentication is no longer required.**
- All registration and login endpoints have been removed.
- All routes are public and accessible without authentication.

**Query database:**
```javascript
// In worker code
const user = await env.DB.prepare(
  'SELECT * FROM users WHERE email = ?'
).bind('packetcatcha@gmail.com').first();
```

### R2 Storage (Images/Assets)

R2 bucket "sellersco" is already configured with `IMAGES` binding.

**Upload images:**
```bash
# Upload via wrangler
npx wrangler r2 object put sellersco/sellerrco.png --file=./public/images/sellerrco.png

# Or via dashboard: Cloudflare > R2 > sellersco
```

**Access in worker:**
```javascript
const object = await env.IMAGES.get('sellerrco.png');
if (object) {
  return new Response(object.body, {
    headers: { 'Content-Type': 'image/png' }
  });
}
```

---

## Custom Domain Setup (One-Time)

To connect **sellersco.net** to the production worker:

### Method 1: Cloudflare Dashboard (Recommended)
1. Go to https://dash.cloudflare.com/
2. Navigate to **Workers & Pages**
3. Click on **sellersco-worker**
4. Go to **Settings** → **Triggers**
5. Under **Custom Domains**, click **Add Custom Domain**
6. Enter: `sellersco.net`
7. Click **Add Custom Domain**

### Method 2: Via Routes
1. Go to https://dash.cloudflare.com/
2. Select the **sellersco.net** domain
3. Click **Workers Routes**
4. Click **Add Route**
5. Route: `sellersco.net/*`
6. Worker: `sellersco-worker`
7. Click **Save**

---

## Deployment History

View recent deployments:
```bash
npx wrangler deployments list
```

Rollback to a previous version:
```bash
npx wrangler rollback [version-id]
```

---

## Environment Configuration

Configuration is in `wrangler.jsonc`:

```jsonc
{
  "env": {
    "dev": {
      "name": "sellersco-worker-dev"
    },
    "production": {
      "name": "sellersco-worker",
      "routes": ["sellersco.net/*"]
    }
  }
}
```

---

## Troubleshooting

### Need to rollback a deployment?
```bash
# List deployments and get version ID
npx wrangler deployments list --env production

# Rollback to previous version
npx wrangler rollback [version-id] --env production
```

### Changes not appearing on sellersco.net?
1. Verify custom domain is set up in Cloudflare Dashboard
2. Check deployment was successful: `npx wrangler deployments list`
3. Clear browser cache or test in incognito mode
4. Verify you deployed to production: `--env production`

### Route errors during deployment?
- The custom domain must be configured in Cloudflare Dashboard first
- Routes in `wrangler.jsonc` may fail if zone isn't found
- Use dashboard to add custom domains instead of CLI routes

---

## NPM Scripts

Defined in `package.json`:

- `npm run dev` - Start local development server
- `npm start` - Alias for `npm run dev`
- `npm test` - Run tests with Vitest
- `npm run deploy` - Deploy to default environment

---

## Important Notes

- **Always deploy to dev first** to test changes before production
- Custom domains require Cloudflare Dashboard setup (can't be done via CLI alone)
- Static assets are served from `./public` directory
- Worker routes are handled by `src/index.js`
- Changes are immediate after deployment (no build step needed)

# Deployment Workflow

## Quick Reference

### Dev Environment
```bash
npx wrangler deploy --env dev
```
**URL**: https://sellersco-worker-dev.application-services-implementation-lab-zippy-operand.workers.dev

### Production Environment
```bash
npx wrangler deploy --env production
```
**URL**: https://sellersco.net (requires custom domain setup)

---

## Standard Workflow

### CRITICAL: Pre-Production Checklist

**📋 MANDATORY: Complete [TESTING.md](./TESTING.md) checklist before ANY production deployment.**

#### 1. Run Automated Tests
```bash
# Test all internal links
./test-links.sh

# Run unit tests
npm test

# Manual testing checklist in TESTING.md
```

#### 2. Backup Production
```bash
# Get current production version
npx wrangler deployments list --env production

# Save the version ID from the most recent deployment
# Example: 4b5a62d2-f37e-4007-8e3d-d64ab10c671c

# Backup production HTML
curl https://sellersco.net > sellersco-backup-$(date +%Y%m%d-%H%M%S).html
```

#### 3. If Rollback Needed
```bash
npx wrangler rollback [version-id] --env production
```

### Development & Deployment Steps

1. **Make changes locally** - Edit files in `public/` or `src/`

2. **Test locally** (optional)
   ```bash
   npm run dev
   # Visit http://localhost:8787
   ```

3. **Deploy to Dev** - Test changes on dev URL
   ```bash
   npx wrangler deploy --env dev
   ```
   Verify at: https://sellersco-worker-dev.application-services-implementation-lab-zippy-operand.workers.dev

4. **Complete Testing** - See [TESTING.md](./TESTING.md)
   - Test all internal links
   - Verify API endpoints
   - Check responsive design
   - Test authentication flow
   - Verify R2 images load
   - Test AI bindings (if applicable)

5. **Deploy to Production** - Push to sellersco.net
   ```bash
   npx wrangler deploy --env production
   ```
   Verify at: https://sellersco.net

---

## AI Infrastructure Setup

### Workers AI Binding
The worker has access to Cloudflare's AI models via the `AI` binding.

**Test AI access:**
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

**Create the security_lab_db database:**
```bash
# Create D1 database
npx wrangler d1 create security_lab_db

# Copy the returned database_id and update wrangler.jsonc
# Replace "placeholder-create-db-first" with actual ID
```

**Update wrangler.jsonc:**
```jsonc
{
  "d1_databases": [{
    "binding": "DB",
    "database_name": "security_lab_db",
    "database_id": "YOUR-ACTUAL-DATABASE-ID-HERE"
  }]
}
```

**Create tables:**
```bash
# Create schema file: sql/schema.sql
npx wrangler d1 execute security_lab_db --file=./sql/schema.sql

# Or execute directly
npx wrangler d1 execute security_lab_db --command="
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  approved BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
"
```

**Query database:**
```javascript
// In worker code
const user = await env.DB.prepare(
  'SELECT * FROM users WHERE email = ?'
).bind('jsellers@nexuminc.com').first();
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

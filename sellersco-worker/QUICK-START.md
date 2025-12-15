# ✅ AI Infrastructure & Testing - Quick Reference

## 🎯 Status Summary

| Component | Status | Action Required |
|-----------|--------|----------------|
| **AI Binding** | ✅ Configured | None - Ready to use |
| **R2 Storage** | ✅ Operational | None - Images working |
| **Vectorize** | ⚠️ Configured | Create index (see below) |
| **D1 Database** | ⚠️ Configured | Create DB (see below) |
| **Testing Scripts** | ✅ Complete | Run on STAGING worker first |
| **Documentation** | ✅ Complete | Review TESTING.md |
| **Production Worker** | ✅ Active | `icy-flower-c586.jsellers.workers.dev` (sellersco.net DNS CNAME) |
| **DNS Configuration** | ✅ Active | See [PRODUCTION-DNS-SETUP.md](./PRODUCTION-DNS-SETUP.md) |

---

## ⚠️ CRITICAL: Testing vs. Production

**PRODUCTION WORKER**: `icy-flower-c586.jsellers.workers.dev` (DNS CNAME → sellersco.net)

**TESTING WORKFLOW**:
1. Make changes locally
2. Deploy to a test/staging worker first
3. Run full test suite on test worker
4. Only then deploy to `icy-flower-c586.jsellers.workers.dev`

---

## 🚀 MANDATORY: Test Before Production

**WORKFLOW** (Never skip steps!):

```
1️⃣ LOCAL TESTING
   npx wrangler dev
   → Test on http://localhost:8787

2️⃣ STAGING TESTING
   npx wrangler deploy --name my-test-worker
   → Test on https://my-test-worker.jsellers.workers.dev
   → Run complete test suite
   → Verify ALL tests pass ✅

3️⃣ PRODUCTION DEPLOYMENT (Only after #1 & #2 complete)
   npx wrangler deploy
   → Deploys to: icy-flower-c586.jsellers.workers.dev (sellersco.net)
   → LIVE PRODUCTION - NO UNDO
```

**CRITICAL**: If you skip step 1 or 2, you will test on production!

---

## 🚀 Pre-Production Quick Start

### Step 1: Create Vectorize Index
```bash
npx wrangler vectorize create security-knowledge-base --dimensions=768 --metric=cosine
npx wrangler vectorize list  # Verify
```

### Step 2: Create D1 Database
```bash
# Create database
npx wrangler d1 create security_lab_db

# Copy the returned database_id
# Update wrangler.jsonc: Replace "placeholder-create-db-first" with actual ID
```

### Step 3: Create D1 Tables
```bash
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

### Step 4: Run Tests on STAGING Worker FIRST
```powershell
# Windows - Deploy to test worker
npx wrangler deploy --name test-worker  # or your staging worker name

# Then test
.\test-links.ps1 -Environment test  # Should show 37/37 passing

# Linux/Mac
./test-links.sh test
```

### Step 5: Deploy to Production (After All Tests Pass)
```bash
# Backup current production
npx wrangler deployments list
curl https://icy-flower-c586.jsellers.workers.dev > backup-$(Get-Date -Format "yyyyMMdd-HHmmss").html

# Deploy to PRODUCTION
npx wrangler deploy

# Test production
.\test-links.ps1 -Environment production
```

---

## 📚 Documentation Reference

| File | Purpose |
|------|---------|
| [TESTING.md](./TESTING.md) | Comprehensive testing procedures & checklists |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment workflow & AI setup instructions |
| [AI-INFRASTRUCTURE.md](./AI-INFRASTRUCTURE.md) | Complete AI infrastructure setup guide |
| [test-links.ps1](./test-links.ps1) | Automated testing script (Windows) |
| [test-links.sh](./test-links.sh) | Automated testing script (Linux/Mac) |
| [copilot-instructions.md](.github/copilot-instructions.md) | GitHub Copilot development guidelines |

---

## 🧪 Testing Commands

```powershell
# Test dev environment
.\test-links.ps1 -Environment dev

# Test production
.\test-links.ps1 -Environment production

# Run unit tests
npm test

# Local development server
npm run dev
```

---

## 🔧 AI Binding Endpoints

### Workers AI
```javascript
// Chat completion
await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
  messages: [{ role: 'user', content: 'Your question' }]
});

// Text embeddings
await env.AI.run('@cf/baai/bge-base-en-v1.5', {
  text: 'Your text to embed'
});
```

### Vectorize (RAG)
```javascript
// Insert vectors
await env.VECTORIZE_INDEX.insert([
  { id: 'doc-1', values: embedding, metadata: { category: 'sase' } }
]);

// Query similar vectors
await env.VECTORIZE_INDEX.query(queryEmbedding, { topK: 5 });
```

### D1 Database
```javascript
// Query users
await env.DB.prepare('SELECT * FROM users WHERE email = ?')
  .bind('user@nexuminc.com').first();

// Insert session
await env.DB.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')
  .bind(userId, token, expiresAt).run();
```

### R2 Storage
```javascript
// Get image
const object = await env.IMAGES.get('sellerrco.png');
return new Response(object.body, { headers: { 'Content-Type': 'image/png' } });
```

---

## 🔄 Rollback Procedure

```bash
# If issues found in production:
npx wrangler deployments list --env production
npx wrangler rollback [version-id] --env production
```

---

## ✅ Current Test Results

**Dev Environment:** https://sellerso-dev.jsellers.workers.dev
- ✅ 37/37 tests passing (100%)
- ✅ All internal links functional
- ✅ All API endpoints working
- ✅ R2 images loading
- ✅ Authentication flow operational

**Production:** https://sellersco.net
- ⏳ Ready for deployment after Vectorize/D1 creation

---

## ⚠️ Critical Reminders

1. **ALWAYS test in dev first:** `npx wrangler deploy --env dev`
2. **ALWAYS backup production:** Get version ID before deploying
3. **ALWAYS run tests:** `.\test-links.ps1` before production deployment
4. **Create infrastructure first:** Vectorize index + D1 database before using bindings
5. **Update wrangler.jsonc:** Replace D1 placeholder ID with actual database_id

---

## 🎯 Next Immediate Actions

1. ⚠️ Create Vectorize index: `npx wrangler vectorize create security-knowledge-base --dimensions=768 --metric=cosine`
2. ⚠️ Create D1 database: `npx wrangler d1 create security_lab_db`
3. ⚠️ Update wrangler.jsonc with real D1 database_id
4. ⚠️ Create D1 tables (SQL script above)
5. ✅ Deploy to production: `npx wrangler deploy --env production`
6. ✅ Run production tests: `.\test-links.ps1 -Environment production`

---

**Need Help?** See detailed instructions in:
- [TESTING.md](./TESTING.md) for testing procedures
- [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment workflow
- [AI-INFRASTRUCTURE.md](./AI-INFRASTRUCTURE.md) for complete AI setup

**Last Updated:** December 14, 2025  
**Status:** ✅ Dev environment ready | ⏳ Production pending infrastructure creation

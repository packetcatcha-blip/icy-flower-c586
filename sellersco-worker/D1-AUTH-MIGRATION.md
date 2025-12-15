# D1 Authentication Migration Guide

## Overview

This guide walks through migrating from the current placeholder token system to a production-ready D1-backed authentication system with proper password hashing and session management.

**Current State:** Simple token validation (`'valid-token-placeholder'`)  
**Target State:** D1 database with bcrypt password hashing and JWT session tokens

---

## Prerequisites

### 1. Create D1 Database

```bash
# Create the database
npx wrangler d1 create security_lab_db

# Output will include database_id like:
# database_id = "abc123def456..."
```

### 2. Update wrangler.jsonc

Replace `"placeholder-create-db-first"` with your actual database ID:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "security_lab_db",
      "database_id": "YOUR-ACTUAL-DATABASE-ID-HERE"
    }
  ]
}
```

Update both `dev` and `production` environments.

### 3. Create Database Schema

Create `sql/schema.sql`:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  approved BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
```

Apply schema:

```bash
npx wrangler d1 execute security_lab_db --file=./sql/schema.sql
```

---

## Implementation Steps

### Step 1: Install Dependencies

Since Workers use Web Crypto API, we don't need external libraries for password hashing. We'll use PBKDF2 for password hashing (built-in).

### Step 2: Add Password Hashing Utilities

Add to `src/utils/auth.js`:

```javascript
/**
 * Hash a password using PBKDF2
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Base64 encoded hash with salt
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordBuffer = encoder.encode(password);
  
  const key = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  // Combine salt and hash
  const combined = new Uint8Array(salt.length + hashBuffer.byteLength);
  combined.set(salt);
  combined.set(new Uint8Array(hashBuffer), salt.length);
  
  // Return base64 encoded
  return btoa(String.fromCharCode(...combined));
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} storedHash - Base64 encoded hash with salt
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(password, storedHash) {
  const encoder = new TextEncoder();
  const combined = Uint8Array.from(atob(storedHash), c => c.charCodeAt(0));
  
  // Extract salt (first 16 bytes)
  const salt = combined.slice(0, 16);
  const storedHashBuffer = combined.slice(16);
  
  const passwordBuffer = encoder.encode(password);
  const key = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  // Compare hashes
  const computedHash = new Uint8Array(hashBuffer);
  if (computedHash.length !== storedHashBuffer.length) return false;
  
  return computedHash.every((byte, i) => byte === storedHashBuffer[i]);
}

/**
 * Generate a secure session token
 * @returns {string} - Cryptographically secure token
 */
export function generateSessionToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Create a session for a user
 * @param {object} env - Worker environment bindings
 * @param {number} userId - User ID
 * @param {number} expiresInHours - Session duration (default 24 hours)
 * @returns {Promise<string>} - Session token
 */
export async function createSession(env, userId, expiresInHours = 24) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();
  
  await env.DB.prepare(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)'
  ).bind(userId, token, expiresAt).run();
  
  return token;
}

/**
 * Validate a session token
 * @param {object} env - Worker environment bindings
 * @param {string} token - Session token
 * @returns {Promise<object|null>} - User object if valid, null otherwise
 */
export async function validateSession(env, token) {
  if (!token) return null;
  
  const result = await env.DB.prepare(`
    SELECT u.id, u.email, u.name, u.approved
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).bind(token).first();
  
  return result;
}

/**
 * Invalidate a session (logout)
 * @param {object} env - Worker environment bindings
 * @param {string} token - Session token
 */
export async function invalidateSession(env, token) {
  await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
}

/**
 * Clean up expired sessions (run periodically)
 * @param {object} env - Worker environment bindings
 */
export async function cleanupExpiredSessions(env) {
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
}
```

### Step 3: Update Registration Endpoint

Update `src/index.js`:

```javascript
import { hashPassword, createSession } from './utils/auth.js';

// ... existing code ...

case '/api/register':
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }
  
  try {
    const body = await request.json();
    const { name, email, password } = body;
    
    // Validate email domain
    if (!email.endsWith('@nexuminc.com')) {
      return Response.json({ error: 'Only @nexuminc.com emails allowed' }, { status: 400 });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    
    // Check if user already exists
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (existingUser) {
      return Response.json({ error: 'Email already registered' }, { status: 409 });
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Insert user (approved=0, requires admin approval)
    await env.DB.prepare(
      'INSERT INTO users (name, email, password_hash, approved) VALUES (?, ?, ?, 0)'
    ).bind(name, email, passwordHash).run();
    
    // Send approval email to admin
    await sendApprovalEmail(env, { name, email });
    
    return Response.json({ 
      success: true, 
      message: 'Registration request submitted. Awaiting approval from admin.' 
    });
  } catch (err) {
    console.error('Registration error:', err);
    return Response.json({ error: 'Registration failed' }, { status: 500 });
  }
```

### Step 4: Update Login Endpoint

```javascript
import { verifyPassword, createSession, validateSession } from './utils/auth.js';

// ... existing code ...

case '/api/login':
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }
  
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Get user from database
    const user = await env.DB.prepare(
      'SELECT id, email, name, password_hash, approved FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (!user) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Check if user is approved
    if (!user.approved) {
      return Response.json({ error: 'Account pending admin approval' }, { status: 403 });
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Create session
    const token = await createSession(env, user.id, 24);
    
    return Response.json({ 
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      message: 'Login successful' 
    });
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
```

### Step 5: Update Protected Route Middleware

Replace the simple token check with session validation:

```javascript
import { validateSession } from './utils/auth.js';

// ... existing code ...

// Check if route is protected
if (PROTECTED_ROUTES.includes(url.pathname)) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  // Validate session from D1
  const user = await validateSession(env, token);
  
  if (!user || !user.approved) {
    return new Response('Unauthorized - Sales content requires authentication', { 
      status: 401,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // Store user in context for later use
  ctx.user = user;
}
```

### Step 6: Add Logout Endpoint

```javascript
import { invalidateSession } from './utils/auth.js';

// ... existing code ...

case '/api/logout':
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }
  
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token) {
      await invalidateSession(env, token);
    }
    
    return Response.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (err) {
    console.error('Logout error:', err);
    return Response.json({ error: 'Logout failed' }, { status: 500 });
  }
```

### Step 7: Update Approval Workflow

```javascript
case '/api/approve-user':
  const token = url.searchParams.get('token');
  const approved = url.searchParams.get('approved');
  const email = url.searchParams.get('email'); // Add email to approval link
  
  if (!token || !email) {
    return new Response('Invalid approval request', { status: 400 });
  }
  
  try {
    if (approved === 'true') {
      // Update user approval status
      await env.DB.prepare(
        'UPDATE users SET approved = 1 WHERE email = ?'
      ).bind(email).run();
      
      return new Response(`
        <html>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2 style="color: #51cf66;">✓ User Approved</h2>
            <p>User ${email} has been approved and can now login.</p>
          </body>
        </html>
      `, { 
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    } else {
      // Delete user if denied
      await env.DB.prepare(
        'DELETE FROM users WHERE email = ?'
      ).bind(email).run();
      
      return new Response(`
        <html>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2 style="color: #ff6b6b;">✗ User Denied</h2>
            <p>Access request for ${email} has been denied and deleted.</p>
          </body>
        </html>
      `, { 
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }
  } catch (err) {
    console.error('Approval error:', err);
    return new Response('Approval failed', { status: 500 });
  }
```

### Step 8: Update Frontend (public/index.html)

Update the login/register handlers to use new response format:

```javascript
// In public/index.html, update login function
async function handleLogin(email, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store token and user info
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userEmail', data.user.email);
    localStorage.setItem('userName', data.user.name);
    
    // Update UI
    updateAuthUI(true, data.user);
  } else {
    showError(data.error);
  }
}
```

---

## Testing the Migration

### 1. Test Registration Flow

```bash
curl -X POST https://sellersco-worker-dev.application-services-implementation-lab-zippy-operand.workers.dev/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@nexuminc.com","password":"SecurePass123"}'
```

Expected: Registration success, approval email sent

### 2. Check Database

```bash
npx wrangler d1 execute security_lab_db --command="SELECT * FROM users"
```

Expected: User record with `approved=0`

### 3. Approve User

Visit the approval link from the email or manually update:

```bash
npx wrangler d1 execute security_lab_db --command="UPDATE users SET approved=1 WHERE email='test@nexuminc.com'"
```

### 4. Test Login

```bash
curl -X POST https://sellersco-worker-dev.application-services-implementation-lab-zippy-operand.workers.dev/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nexuminc.com","password":"SecurePass123"}'
```

Expected: Login success with session token

### 5. Test Protected Route

```bash
curl -H "Authorization: Bearer <token-from-login>" \
  https://sellersco-worker-dev.application-services-implementation-lab-zippy-operand.workers.dev/sales-portal
```

Expected: 200 OK (or appropriate protected content)

### 6. Test Logout

```bash
curl -X POST https://sellersco-worker-dev.application-services-implementation-lab-zippy-operand.workers.dev/api/logout \
  -H "Authorization: Bearer <token-from-login>"
```

Expected: Logout success

### 7. Test Invalid Token

```bash
curl -H "Authorization: Bearer invalid-token" \
  https://sellersco-worker-dev.application-services-implementation-lab-zippy-operand.workers.dev/sales-portal
```

Expected: 401 Unauthorized

---

## Deployment Checklist

- [ ] Database created and schema applied
- [ ] `wrangler.jsonc` updated with database ID
- [ ] `src/utils/auth.js` created with auth utilities
- [ ] Registration endpoint updated
- [ ] Login endpoint updated
- [ ] Protected route middleware updated
- [ ] Logout endpoint added
- [ ] Approval workflow updated
- [ ] Frontend updated to use new auth flow
- [ ] All tests passing
- [ ] Deployed to dev and tested
- [ ] Deployed to production

---

## Security Best Practices

1. **Password Requirements:**
   - Minimum 8 characters (enforce 12+ for production)
   - Consider adding complexity requirements (uppercase, numbers, symbols)

2. **Session Management:**
   - 24-hour default expiration (adjust as needed)
   - Clean up expired sessions periodically
   - Implement "remember me" functionality carefully

3. **Rate Limiting:**
   - Add rate limiting to login/register endpoints (consider Cloudflare Rate Limiting)
   - Track failed login attempts

4. **Email Verification:**
   - Consider adding email verification before admin approval
   - Use signed tokens in approval emails

5. **HTTPS Only:**
   - Ensure all requests use HTTPS
   - Set secure cookie flags if using cookies

---

## Maintenance

### Clean Up Expired Sessions

Add to worker as scheduled task or cron:

```javascript
// In src/index.js, add cleanup on certain requests
if (Math.random() < 0.01) { // 1% of requests
  ctx.waitUntil(cleanupExpiredSessions(env));
}
```

### Monitor Failed Logins

Track failed login attempts in D1 or logs:

```javascript
await env.DB.prepare(
  'INSERT INTO login_attempts (email, success, ip_address, timestamp) VALUES (?, ?, ?, ?)'
).bind(email, false, request.headers.get('CF-Connecting-IP'), new Date().toISOString()).run();
```

---

## Rollback Plan

If issues occur after deployment:

1. Revert to placeholder token system:
   ```bash
   git revert <commit-hash>
   npx wrangler deploy --env production
   ```

2. Users with active sessions will need to re-login

3. Database data preserved for future migration attempt

---

**For questions or issues, contact:** jsellers@nexuminc.com

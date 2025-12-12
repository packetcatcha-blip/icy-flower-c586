# Copilot Instructions for sellersco-worker

## Project Overview
This is a Cloudflare Workers project with static asset serving. The worker handles API routes while serving a static HTML site from `public/`.

## Architecture Patterns

### Worker Export Structure
- Workers **must** export a default object with a `fetch` method: `export default { async fetch(request, env, ctx) {...} }`
- The fetch handler receives: `request` (Request), `env` (bindings), `ctx` (execution context)
- Route handling uses `new URL(request.url).pathname` with switch statements (see `src/index.js`)

### Static Assets Configuration
- Static files in `public/` are automatically served via `wrangler.jsonc` assets config
- The `public/index.html` serves as the default route (`/`) 
- API routes defined in the worker (like `/message`, `/random`) take precedence over static assets

## Development Workflow

### Running & Testing
- **Dev server**: `npm run dev` or `npm start` (starts local server at http://localhost:8787)
- **Tests**: `npm test` (runs Vitest with Cloudflare Workers pool)
- **Deploy**: `npm run deploy` (publishes to Cloudflare)

### Testing Patterns
Tests use `@cloudflare/vitest-pool-workers` with two styles:

1. **Unit style**: Import worker directly, create execution context
   ```javascript
   const ctx = createExecutionContext();
   const response = await worker.fetch(request, env, ctx);
   await waitOnExecutionContext(ctx);
   ```

2. **Integration style**: Use `SELF` to test via network simulation
   ```javascript
   const response = await SELF.fetch(request);
   ```

Both styles are demonstrated in `test/index.spec.js`. Use unit style for isolated logic, integration style for end-to-end flows.

## Configuration Files

### wrangler.jsonc
- Uses JSONC format (comments allowed)
- Key settings: `main`, `compatibility_date`, `compatibility_flags`, `assets`
- Node.js compatibility enabled via `nodejs_compat` flag
- Vitest reads this config via `vitest.config.js` to match test environment with production

## Common Patterns

### API Response Conventions
- **JSON responses**: Use `Response.json({ message: "..." })` with `Content-Type: application/json` (see `/message` endpoint)
- **Plain text**: Use `new Response('text', { status: 200 })` for simple strings (see `/random` endpoint)
- **Error responses**: Return appropriate status codes (404 for not found, 500 for errors)

### Utilities & Web APIs
- Use `crypto.randomUUID()` for generating UUIDs (native Web Crypto API, no imports needed)
- Test assertions use `toMatchInlineSnapshot()` for exact string matching or regex patterns for dynamic values

## Adding Cloudflare Bindings (When Needed)

### Configuration
Currently no bindings are configured. To add KV, D1, R2, or other bindings:

1. Add to `wrangler.jsonc`:
   ```jsonc
   {
     "kv_namespaces": [{ "binding": "MY_KV", "id": "..." }],
     "d1_databases": [{ "binding": "DB", "database_id": "..." }]
   }
   ```

2. Access in worker via `env` parameter:
   ```javascript
   async fetch(request, env, ctx) {
     await env.MY_KV.get("key");
     await env.DB.prepare("SELECT * FROM users").all();
   }
   ```

3. Mock in tests using `env` parameter:
   ```javascript
   const env = { MY_KV: mockKV };
   const response = await worker.fetch(request, env, ctx);
   ```

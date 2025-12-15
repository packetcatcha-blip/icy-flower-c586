/**
 * Integration Guide: Adding Tracing to Your Worker
 * 
 * This shows the minimal changes needed to add tracing to src/index.js
 */

// ============================================================================
// BEFORE: Your current src/index.js (partial)
// ============================================================================

/*
import { handleQuantumRoute } from './quantum-module.js';
import { QuantumDurableObject } from './quantum-durable-object.js';
// ... other imports

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/quantum' || url.pathname.startsWith('/quantum/')) {
      return handleQuantumRoute(url.pathname, request, env, ctx);
    }
    
    // ... rest of routes
  }
};
*/

// ============================================================================
// AFTER: With Tracing Added
// ============================================================================

import { handleQuantumRoute } from './quantum-module.js';
import { QuantumDurableObject } from './quantum-durable-object.js';
import initializeTracing from './tracing.js';
import { traceRequest } from './workers-tracing-utils.js';

// Initialize tracing on startup
const sdk = initializeTracing();
sdk.start();

export default {
  async fetch(request, env, ctx) {
    // Wrap entire fetch handler with request tracing
    return traceRequest(request, async () => {
      const url = new URL(request.url);
      
      if (url.pathname === '/quantum' || url.pathname.startsWith('/quantum/')) {
        return handleQuantumRoute(url.pathname, request, env, ctx);
      }
      
      // ... rest of routes (all automatically traced)
      
      return new Response('Not Found', { status: 404 });
    });
  }
};

// ============================================================================
// STEP-BY-STEP INTEGRATION
// ============================================================================

/*
Step 1: Add imports at the top
───────────────────────────────────────────────────────────────────────────────
import initializeTracing from './tracing.js';
import { traceRequest } from './workers-tracing-utils.js';


Step 2: Initialize tracing before export
───────────────────────────────────────────────────────────────────────────────
// Add these lines after imports
const sdk = initializeTracing();
sdk.start();


Step 3: Wrap fetch handler with tracing
───────────────────────────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    // Change from this:
    //   const url = new URL(request.url);
    //   ... rest of code
    
    // To this:
    return traceRequest(request, async () => {
      const url = new URL(request.url);
      // ... rest of code (exactly the same)
    });
  }
};


That's it! Your entire worker is now traced automatically.
*/

// ============================================================================
// OPTIONAL: Add Tracing to Specific Handlers
// ============================================================================

/*
For advanced tracing within specific modules, import and use in those files:

// In src/quantum-module.js:
import { traceAICall, traceD1Operation } from './workers-tracing-utils.js';

export async function handleQuantumRoute(pathname, request, env, ctx) {
  // ... route logic
  
  // Trace AI calls
  const response = await traceAICall('@cf/meta/llama-2-7b-chat-int8', query, async () => {
    return await env.AI.run('@cf/meta/llama-2-7b-chat-int8', { prompt });
  });
  
  // Trace database operations
  const results = await traceD1Operation('query', 'SELECT ...', async () => {
    return await env.DB.prepare('SELECT ...').all();
  });
}
*/

// ============================================================================
// VERIFY SETUP
// ============================================================================

/*
Check that tracing is working:

1. Run your worker:
   npm run dev
   
2. Make a request:
   curl http://localhost:8787/
   
3. Check AI Toolkit trace viewer:
   - You should see a trace for GET /
   - It will show HTTP method, URL, status code
   - Duration in milliseconds
   
4. Open trace details to see:
   - HTTP request attributes
   - Response status
   - Any errors (if applicable)
*/

export { QuantumDurableObject };

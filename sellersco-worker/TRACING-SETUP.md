# Tracing Setup for Sellersco Worker

## Overview

Tracing has been successfully integrated into your Cloudflare Workers application using **OpenTelemetry**. This provides comprehensive observability for:

- HTTP request handling
- Workers AI API calls
- R2 bucket operations
- D1 database queries
- Vectorize (embeddings) operations
- KV store operations
- Authentication workflows

---

## Quick Start

### 1. Enable Tracing in Your Worker

Add tracing initialization to your main worker file (`src/index.js`):

```javascript
import initializeTracing from './tracing.js';
import { traceRequest } from './workers-tracing-utils.js';

// Initialize tracing at startup
const sdk = initializeTracing();
sdk.start();

export default {
  async fetch(request, env, ctx) {
    // Wrap your request handler with tracing
    return traceRequest(request, async () => {
      // Your existing fetch handler code here
      const url = new URL(request.url);
      // ... rest of your handler
    });
  }
};
```

### 2. Open the Trace Viewer

The trace viewer is already open in AI Toolkit. You'll see real-time traces as you run your application.

### 3. View Traces

- Run your worker: `npm run dev` or deploy with `npx wrangler deploy`
- Traces automatically appear in the AI Toolkit trace viewer
- Click on spans to see details about each operation

---

## Adding Traces to Your Code

### Tracing HTTP Requests

```javascript
import { traceRequest } from './workers-tracing-utils.js';

// Automatically traced with HTTP method, URL, and status code
return traceRequest(request, async () => {
  // Handle request
  return new Response('OK', { status: 200 });
});
```

### Tracing Workers AI Calls

```javascript
import { traceAICall } from './workers-tracing-utils.js';

// Example: Using Llama for chat
const result = await traceAICall('@cf/meta/llama-2-7b-chat-int8', { prompt }, async () => {
  return await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
    prompt: 'Your prompt here',
    stream: false
  });
});
```

### Tracing R2 Operations

```javascript
import { traceR2Operation } from './workers-tracing-utils.js';

// Get image from R2
const image = await traceR2Operation('get', 'images/attack-map.png', async () => {
  return await env.IMAGES.get('images/attack-map.png');
});

// Put object in R2
await traceR2Operation('put', 'cache/data.json', async () => {
  return await env.IMAGES.put('cache/data.json', data);
});
```

### Tracing D1 Database Queries

```javascript
import { traceD1Operation } from './workers-tracing-utils.js';

// Execute database query
const results = await traceD1Operation('query', 'SELECT * FROM users WHERE id = ?', async () => {
  return await env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(userId)
    .all();
});

// Execute insert
await traceD1Operation('insert', 'INSERT INTO sessions ...', async () => {
  return await env.DB.prepare('INSERT INTO sessions (user_id, token) VALUES (?, ?)')
    .bind(userId, token)
    .run();
});
```

### Tracing Vectorize Operations

```javascript
import { traceVectorizeOperation } from './workers-tracing-utils.js';

// Query embeddings index
const results = await traceVectorizeOperation('query', 'security-knowledge-base', async () => {
  return await env.VECTORIZE_INDEX.query(embedding, { topK: 10 });
});

// Upsert embeddings
await traceVectorizeOperation('upsert', 'security-knowledge-base', async () => {
  return await env.VECTORIZE_INDEX.upsert([{
    id: '1',
    values: embedding,
    metadata: { title: 'Document' }
  }]);
});
```

### Tracing KV Operations

```javascript
import { traceKVOperation } from './workers-tracing-utils.js';

// Get from KV
const cached = await traceKVOperation('get', 'cache:attack-patterns', async () => {
  return await env.QUANTUM_KV.get('cache:attack-patterns');
});

// Put in KV
await traceKVOperation('put', 'cache:attack-patterns', async () => {
  return await env.QUANTUM_KV.put('cache:attack-patterns', JSON.stringify(data));
});
```

### Tracing Authentication

```javascript
import { traceAuthOperation } from './workers-tracing-utils.js';

// Register user
const result = await traceAuthOperation('register', async () => {
  // Your registration logic
  return { success: true, email };
});

// Login
const session = await traceAuthOperation('login', async () => {
  // Your login logic
  return { token, userId };
});

// Authorization check
const authorized = await traceAuthOperation('authorize', async () => {
  // Check if user has access
  return user.role === 'admin';
});
```

---

## Trace Viewer Features

### View Spans

1. **Timeline View**: See all spans with their duration
2. **Span Details**: Click any span to see:
   - Attributes (HTTP method, URL, model name, etc.)
   - Status (OK or ERROR)
   - Duration
   - Exception details if error occurred

### Filter Traces

- By operation type (HTTP, AI, R2, D1, etc.)
- By status (success or error)
- By duration

### Analyze Performance

- Identify slow operations
- Track AI API response times
- Monitor database query performance
- Debug error chains

---

## Environment Variables

Configure tracing with environment variables:

```bash
# OTLP Endpoint (defaults to localhost:4318)
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces

# Service name for traces
OTEL_SERVICE_NAME=sellersco-worker

# Enable console logging for development
NODE_ENV=development  # Enables console span exporter
```

---

## Best Practices

1. **Wrap Key Operations**: Always wrap long-running operations (AI calls, DB queries, R2 operations)

2. **Include Context**: Add meaningful attributes to spans for debugging

3. **Error Handling**: Traces automatically capture exceptions, but ensure errors are logged

4. **Production Tracing**: In production, use only OTLP exporter (remove console exporter)

5. **Sensitive Data**: Avoid logging sensitive information (passwords, tokens) in span attributes

---

## Files Added

| File | Purpose |
|------|---------|
| `src/tracing.js` | Core OpenTelemetry configuration |
| `src/workers-tracing-utils.js` | Cloudflare Workers-specific tracing utilities |
| `src/index.js` | **Instrumented**: tracing initialized and `fetch` wrapped with `traceRequest` |
| `package.json` | Added OpenTelemetry dependencies |

---

## Next Steps

1. ✅ Tracing infrastructure is set up
2. 📝 Add tracing to your route handlers (see examples above)
3. 🚀 Deploy and monitor traces in real-time
4. 🔍 Use trace data to optimize performance

---

## Troubleshooting

### Traces Not Appearing

- Ensure AI Toolkit trace viewer is open: `ai-mlstudio.tracing.open`
- Check that OTEL_EXPORTER_OTLP_ENDPOINT is set correctly
- Verify OpenTelemetry packages are installed: `npm ls @opentelemetry/api`

### Trace Collector Connection Error

- Ensure AI Toolkit is running
- Check that port 4318 is available
- Try restart: Close and reopen AI Toolkit

### High Memory Usage

- Remove console exporter in production
- Use sampling for high-traffic applications
- Archive old traces in the trace viewer

---

## Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [AI Toolkit Tracing Guide](https://learn.microsoft.com/en-us/windows/ai/toolkit/)

---

**Status**: ✅ Tracing successfully configured and ready to use!


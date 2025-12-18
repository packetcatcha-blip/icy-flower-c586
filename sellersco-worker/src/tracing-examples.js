/**
 * Tracing Integration Example
 * 
 * This example shows how to integrate tracing into your existing modules.
 * Apply these patterns to your actual route handlers and modules.
 */

import { traceRequest, traceAICall, traceAuthOperation, traceD1Operation } from './workers-tracing-utils.js';

/**
 * Example: Add tracing to your quantum module routes
 */
export async function handleQuantumRouteWithTracing(pathname, request, env, ctx) {
  return traceRequest(request, async () => {
    // Route handling with automatic HTTP tracing

    // Example: AI chat endpoint
    if (pathname === '/quantum/chat') {
      const { query } = await request.json();

      // Trace AI API call
      const response = await traceAICall('@cf/meta/llama-2-7b-chat-int8', { query }, async () => {
        return await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
          prompt: `Answer this quantum computing question: ${query}`,
          stream: false
        });
      });

      return new Response(JSON.stringify({ response }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Example: Quiz submission endpoint
    if (pathname === '/quantum/quiz' && request.method === 'POST') {
      const { userId, answers } = await request.json();

      // Trace database write
      const result = await traceD1Operation('insert', 'INSERT INTO quiz_results ...', async () => {
        return await env.DB.prepare(
          'INSERT INTO quiz_results (user_id, score, answers, created_at) VALUES (?, ?, ?, ?)'
        ).bind(
          userId,
          calculateScore(answers),
          JSON.stringify(answers),
          new Date().toISOString()
        ).run();
      });

      return new Response(JSON.stringify({ success: true, result }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not Found', { status: 404 });
  });
}

/**
 * Example: Add tracing to authentication flow
 */
export async function handleAuthWithTracing(request, env) {
  return traceRequest(request, async () => {
    const { email, password } = await request.json();

    // Trace user lookup
    const user = await traceD1Operation('query', 'SELECT * FROM users WHERE email = ?', async () => {
      return await env.DB.prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .first();
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Trace authentication check
    const authenticated = await traceAuthOperation('login', async () => {
      // Verify password (example - use bcrypt in real app)
      return password === user.password_hash;
    });

    if (!authenticated) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Trace session creation
    const token = await traceAuthOperation('create-session', async () => {
      const sessionToken = crypto.randomUUID();
      await env.DB.prepare(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)'
      ).bind(user.id, sessionToken, new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
       .run();
      return sessionToken;
    });

    return new Response(JSON.stringify({ success: true, token }), {
      headers: { 'Content-Type': 'application/json' }
    });
  });
}

/**
 * Example: Middleware to add tracing to all requests
 */
export function createTracingMiddleware() {
  return async (request, handler) => {
    return traceRequest(request, () => handler(request));
  };
}

/**
 * Example: Trace complex operation with multiple sub-spans
 */
export async function traceComplexOperation() {
  const { trace } = require('@opentelemetry/api');
  const tracer = trace.getTracer('sellersco-worker');

  // Parent span: User data enrichment
  return tracer.startActiveSpan('user-enrichment', async (parentSpan) => {
    try {
      // Sub-operation 1: Fetch user from DB
      const user = await tracer.startActiveSpan('fetch-user', async (span) => {
        return await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
      });

      // Sub-operation 2: Fetch user's quiz results
      const results = await tracer.startActiveSpan('fetch-results', async (span) => {
        return await env.DB.prepare('SELECT * FROM quiz_results WHERE user_id = ?').bind(userId).all();
      });

      // Sub-operation 3: Generate AI-powered recommendations
      const recommendations = await tracer.startActiveSpan('ai-recommendations', async (span) => {
        return await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
          prompt: `Based on quiz results ${JSON.stringify(results)}, provide learning recommendations`
        });
      });

      parentSpan.setStatus({ code: 0 }); // OK
      return { user, results, recommendations };
    } catch (error) {
      parentSpan.recordException(error);
      parentSpan.setStatus({ code: 2, message: error.message });
      throw error;
    } finally {
      parentSpan.end();
    }
  });
}

function calculateScore(answers) {
  // Your scoring logic
  return answers.filter(a => a.correct).length;
}

export default {
  handleQuantumRouteWithTracing,
  handleAuthWithTracing,
  createTracingMiddleware,
  traceComplexOperation,
};

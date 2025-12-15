/**
 * Cloudflare Workers Tracing Utilities
 * 
 * Custom tracing helpers for Cloudflare Workers operations.
 * Tracks fetch operations, bindings access, and route handling.
 */

import { trace, context, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('sellersco-worker');

/**
 * Trace a request through the worker
 * 
 * @param {Request} request - Incoming request
 * @param {Function} handler - Handler function
 * @returns {Promise<Response>} Handler response
 */
export async function traceRequest(request, handler) {
  const url = new URL(request.url);
  const spanName = `${request.method} ${url.pathname}`;

  return tracer.startActiveSpan(spanName, async (span) => {
    try {
      span.setAttributes({
        'http.method': request.method,
        'http.url': request.url,
        'http.target': url.pathname,
        'http.host': url.hostname,
      });

      const response = await handler();

      span.setAttributes({
        'http.status_code': response.status,
      });

      if (response.status >= 400) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: `HTTP ${response.status}`,
        });
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }

      return response;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Trace Workers AI API calls
 * 
 * @param {string} model - Model name
 * @param {Object} input - Model input
 * @param {Function} handler - Async handler calling AI
 * @returns {Promise} Handler result
 */
export async function traceAICall(model, input, handler) {
  return tracer.startActiveSpan(`AI.${model}`, async (span) => {
    try {
      span.setAttributes({
        'ai.model': model,
        'ai.input.type': typeof input,
      });

      const result = await handler();

      span.setAttributes({
        'ai.result.type': typeof result,
      });

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Trace R2 bucket operations
 * 
 * @param {string} operation - Operation name (get, put, delete, etc.)
 * @param {string} key - Object key
 * @param {Function} handler - Async handler for R2 operation
 * @returns {Promise} Handler result
 */
export async function traceR2Operation(operation, key, handler) {
  return tracer.startActiveSpan(`R2.${operation}`, async (span) => {
    try {
      span.setAttributes({
        'r2.operation': operation,
        'r2.key': key,
      });

      const result = await handler();

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Trace D1 database operations
 * 
 * @param {string} operation - Operation name (query, execute, etc.)
 * @param {string} statement - SQL statement
 * @param {Function} handler - Async handler for DB operation
 * @returns {Promise} Handler result
 */
export async function traceD1Operation(operation, statement, handler) {
  return tracer.startActiveSpan(`D1.${operation}`, async (span) => {
    try {
      span.setAttributes({
        'db.operation': operation,
        'db.statement': statement.substring(0, 500), // Truncate long statements
        'db.system': 'd1',
      });

      const result = await handler();

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Trace Vectorize (embeddings) operations
 * 
 * @param {string} operation - Operation name (query, upsert, etc.)
 * @param {string} indexName - Index name
 * @param {Function} handler - Async handler
 * @returns {Promise} Handler result
 */
export async function traceVectorizeOperation(operation, indexName, handler) {
  return tracer.startActiveSpan(`Vectorize.${operation}`, async (span) => {
    try {
      span.setAttributes({
        'vectorize.operation': operation,
        'vectorize.index': indexName,
      });

      const result = await handler();

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Trace KV (Key-Value store) operations
 * 
 * @param {string} operation - Operation name (get, put, delete, etc.)
 * @param {string} key - Key name
 * @param {Function} handler - Async handler
 * @returns {Promise} Handler result
 */
export async function traceKVOperation(operation, key, handler) {
  return tracer.startActiveSpan(`KV.${operation}`, async (span) => {
    try {
      span.setAttributes({
        'kv.operation': operation,
        'kv.key': key,
      });

      const result = await handler();

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Trace authentication/authorization checks
 * 
 * @param {string} operation - Operation name (login, register, authorize, etc.)
 * @param {Function} handler - Async handler
 * @returns {Promise} Handler result
 */
export async function traceAuthOperation(operation, handler) {
  return tracer.startActiveSpan(`Auth.${operation}`, async (span) => {
    try {
      span.setAttributes({
        'auth.operation': operation,
      });

      const result = await handler();

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Get current trace context for propagation
 * 
 * @returns {Object} Context object
 */
export function getTraceContext() {
  return context.active();
}

/**
 * Run code within a specific trace context
 * 
 * @param {Object} ctx - Context object
 * @param {Function} fn - Function to run
 * @returns {Promise} Function result
 */
export function runWithContext(ctx, fn) {
  return context.with(ctx, fn);
}

export default {
  traceRequest,
  traceAICall,
  traceR2Operation,
  traceD1Operation,
  traceVectorizeOperation,
  traceKVOperation,
  traceAuthOperation,
  getTraceContext,
  runWithContext,
};

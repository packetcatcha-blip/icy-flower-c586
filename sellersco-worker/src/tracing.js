/**
 * OpenTelemetry Tracing Configuration
 * 
 * This file sets up tracing for the Cloudflare Workers application.
 * Traces are sent to the AI Toolkit trace collector for visualization.
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { trace } from '@opentelemetry/api';

/**
 * Initialize OpenTelemetry tracing
 * 
 * @returns {NodeSDK} Configured SDK instance
 */
export function initializeTracing() {
  // OTLP exporter configuration
  // Points to AI Toolkit trace collector
  const otlpExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  });

  // Console exporter for development/debugging
  const consoleExporter = new ConsoleSpanExporter();

  // Create SDK with auto-instrumentation
  const sdk = new NodeSDK({
    traceExporter: otlpExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  // Add console exporter for development
  if (process.env.NODE_ENV !== 'production') {
    sdk.traceProvider?.addSpanProcessor(new SimpleSpanProcessor(consoleExporter));
  }

  return sdk;
}

/**
 * Manual span creation helper
 * 
 * Use this only for custom tracing needs not covered by auto-instrumentation
 * 
 * @param {string} spanName - Name of the span
 * @param {Function} fn - Async function to trace
 * @returns {Promise} Result of the function
 */
export async function traceSpan(spanName, fn) {
  const tracer = trace.getTracer('sellersco-worker');
  
  return tracer.startActiveSpan(spanName, async (span) => {
    try {
      const result = await fn();
      span.setStatus({ code: 0 }); // OK
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: 2, message: error.message }); // ERROR
      throw error;
    } finally {
      span.end();
    }
  });
}

export default initializeTracing;

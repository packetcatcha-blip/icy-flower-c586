#!/usr/bin/env node
/**
 * Tracing verification script for CI
 * - Starts the OpenTelemetry SDK from src/tracing.js
 * - Emits a test span (using traceSpan)
 * - Shuts down the SDK and exits
 */
import initializeTracing, { traceSpan } from '../src/tracing.js';

async function main() {
  // Initialize SDK and start it
  const sdk = initializeTracing();
  try {
    await sdk.start();
  } catch (err) {
    console.error('Failed to start tracing SDK:', err);
    process.exit(1);
  }

  try {
    await traceSpan('ci.verify.tracing', async () => {
      // Simulate small work
      await new Promise((r) => setTimeout(r, 100));
      return 'ok';
    });

    console.log('TRACE_VERIFICATION_OK');
  } catch (err) {
    console.error('TRACE_VERIFICATION_FAIL', err);
    process.exit(1);
  } finally {
    try {
      await sdk.shutdown();
    } catch (err) {
      console.error('Error shutting down tracing SDK:', err);
      // Don't override previous failure
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

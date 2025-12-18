import { describe, it, expect } from 'vitest';
import initializeTracing from '../src/tracing.js';

describe('tracing initialization', () => {
	it('returns an SDK object with a start method', () => {
		const sdk = initializeTracing();
		expect(sdk).toBeDefined();
		expect(sdk).toHaveProperty('start');
		expect(typeof sdk.start).toBe('function');
	});
});

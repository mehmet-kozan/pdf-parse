import { describe, expect, test } from 'vitest';

import { getHeaderRequest } from '../../../src/pdf-parse/HeaderResult.js';

describe('get-header test', () => {
	test('check bitcoin url, getHeader helper', { timeout: 30000 }, async () => {
		const result = await getHeaderRequest('https://bitcoin.org/bitcoin.pdf', false);
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
		expect(result.fileSize).toBe(184292);
		expect(result.validPdf).toBeUndefined();
	});

	test('check bitcoin url, with true param, getHeader helper', { timeout: 30000 }, async () => {
		const result = await getHeaderRequest('https://bitcoin.org/bitcoin.pdf', true);
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(206);
		expect(result.fileSize).toBe(184292);
		expect(result.validPdf).toBe(true);
	});
});

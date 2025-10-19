import { getHeader } from 'pdf-parse/node';
import { describe, expect, test } from 'vitest';

describe('get-header test', () => {
	test('check bitcoin url, getHeader helper', { timeout: 30000 }, async () => {
		const result = await getHeader('https://bitcoin.org/bitcoin.pdf');
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
		expect(result.size).toBe(184292);
		expect(result.magic).toBe(null);
	});

	test('check bitcoin url, with true param, getHeader helper', { timeout: 30000 }, async () => {
		const result = await getHeader('https://bitcoin.org/bitcoin.pdf', true);
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
		expect(result.size).toBe(184292);
		expect(result.magic).toBe(true);
	});
});

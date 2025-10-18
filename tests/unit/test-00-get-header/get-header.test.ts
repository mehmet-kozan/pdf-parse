import { getHeader } from 'pdf-parse/utils';
import { describe, expect, test } from 'vitest';

describe('get-header test', () => {
	test('check bitcoin url, getHeader helper', { timeout: 30000 }, async () => {
		const result = await getHeader('https://bitcoin.org/bitcoin.pdf');
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
		expect(result.size).toBe(184292);
		expect(result.isPdf).toBe(undefined);
	});

	test('check bitcoin url, with true param, getHeader helper', { timeout: 30000 }, async () => {
		const result = await getHeader('https://bitcoin.org/bitcoin.pdf', true);
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
		expect(result.size).toBe(184292);
		expect(result.isPdf).toBe(true);
	});
});

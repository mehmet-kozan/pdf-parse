import { getHeader } from 'pdf-parse/node';
import { describe, expect, test } from 'vitest';

describe('get-header node test', () => {
	test('check bitcoin url, getHeader helper', { timeout: 30000 }, async () => {
		const result = await getHeader('https://bitcoin.org/bitcoin.pdf', false);
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
	});

	test('check bitcoin url, with true param, getHeader helper', { timeout: 30000 }, async () => {
		const result = await getHeader('https://bitcoin.org/bitcoin.pdf', true);
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
	});
});

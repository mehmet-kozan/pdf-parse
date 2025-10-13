import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';

describe('get-header test', () => {
	test('check bitcoin url', async () => {
		const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });

		const result = await parser.getHeader(true);
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
		expect(result.size).toBe(184292);
		expect(result.isPdf).toBe(true);
	});
});

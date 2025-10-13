import { describe, expect, test } from 'vitest';
import { getHeader, PDFParse } from '../../src/index';

describe('get-header test', () => {
	test('check bitcoin url', async () => {
		const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });

		const result = await parser.getHeader();
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
		expect(result.size).toBe(184292);
		expect(result.isPdf).toBe(undefined);
	});

	test('check bitcoin url, with true param', async () => {
		const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });

		const result = await parser.getHeader(true);
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
		expect(result.size).toBe(184292);
		expect(result.isPdf).toBe(true);
	});

	test('check bitcoin url, getHeader helper', async () => {
		const result = await getHeader('https://bitcoin.org/bitcoin.pdf');
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
		expect(result.size).toBe(184292);
		expect(result.isPdf).toBe(undefined);
	});

	test('check bitcoin url, with true param, getHeader helper', async () => {
		const result = await getHeader('https://bitcoin.org/bitcoin.pdf', true);
		expect(result.ok).toBeTruthy();
		expect(result.status).toBe(200);
		expect(result.size).toBe(184292);
		expect(result.isPdf).toBe(true);
	});
});

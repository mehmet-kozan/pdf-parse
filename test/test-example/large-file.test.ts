import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/PDFParse';

describe('Large PDF File Tests', () => {
	test('should parse IPCC Climate Report (very large)', { timeout: 30000 }, async () => {
		// IPCC Climate Report - 20+ MB
		const url = 'https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_SPM.pdf';

		const parser = new PDFParse({
			url,

			// Disable automatically download additional pages.
			// If true, will not auto-fetch pages of the file.
			// It is also necessary to disable streaming for disabling of pre-fetching to work correctly.
			disableAutoFetch: true,

			// Disables streaming-based loading. When true, streaming is not used and data is fetched in chunks.
			// Often used with range requests to get predictable partial-download behavior.
			disableStream: true,

			// Number of bytes requested per range request.
			// Smaller values -> more requests; larger values -> fewer, bigger requests.
			// Example: 131072 = 128 KB
			// Default: 65536 (= 2^16)
			rangeChunkSize: 65536,
		});

		const result = await parser.getText({
			first: 3, // Only first 3 pages
		});

		await parser.destroy();

		expect(result.pages.length).toBeLessThanOrEqual(3);
		expect(result.text.length).toBeGreaterThan(0);
		expect(parser.progress.total).toBeGreaterThan(parser.progress.loaded);
	});

	test('should handle arxiv.org research paper', { timeout: 30000 }, async () => {
		const parser = new PDFParse({
			url: 'https://arxiv.org/pdf/1706.03762.pdf',
			disableAutoFetch: true,
			disableStream: true,
			rangeChunkSize: 65536,
		});

		const result = await parser.getText({
			last: 1,
		});

		await parser.destroy();

		expect(result.text).toContain('We give two such examples above');
		expect(result.pages.length).toBeLessThanOrEqual(1);
		expect(parser.progress.total).toBeGreaterThan(parser.progress.loaded);
	});

	test('should parse Bitcoin Whitepaper (small but reliable)', { timeout: 30000 }, async () => {
		// Bitcoin Whitepaper - ~180 KB (small but good for testing)
		const url = 'https://bitcoin.org/bitcoin.pdf';

		const parser = new PDFParse({ url });

		const result = await parser.getText();
		await parser.destroy();

		expect(result.text).toContain('Bitcoin');
		expect(result.text).toContain('Satoshi Nakamoto');
		expect(parser.progress.total).toBe(parser.progress.loaded);
	});
});

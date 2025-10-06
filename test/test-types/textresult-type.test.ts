import { describe, expect, test } from 'vitest';
import { type InfoResult, type Metadata, PDFParse, type TextResult } from '../../src/index';

const URL_STR = 'https://web.archive.org/web/20150922024138/http://www.minneapolismn.gov/www/groups/public/@clerk/documents/webcontent/wcms1p-094235.pdf';

describe('TextResult, InfoResult, and Metadata Type Tests', () => {
	let parser: PDFParse;
	let result: TextResult;

	test('should initialize parser and get text result', async () => {
		parser = new PDFParse({ url: new URL(URL_STR) });
		result = await parser.getText();
		expect(result).toBeDefined();
	});

	describe('InfoResult properties', () => {
		test('should have total property of type number', async () => {
			expect(result.total).toBeDefined();
			expect(typeof result.total).toBe('number');
			expect(result.total).toBeGreaterThan(0);
		});

		test('should have info property (optional object)', async () => {
			if (result.info) {
				expect(typeof result.info).toBe('object');
				expect(result.info).not.toBeNull();
			}
		});

		test('should have metadata property (optional Metadata type)', async () => {
			if (result.metadata) {
				expect(result.metadata).toBeDefined();
				expect(typeof result.metadata).toBe('object');
				expect(typeof result.metadata).toBe('object');
			}
		});
	});

	describe('Metadata type properties', () => {
		test('should check metadata get method', async () => {
			if (result.metadata) {
				expect(typeof result.metadata.get).toBe('function');
				// Test common PDF metadata fields
				const title = result.metadata.get('dc:title');
				// These may or may not exist, but calling them should not throw
				expect(title === null || typeof title === 'string' || Array.isArray(title)).toBe(true);
			}
		});

		test('should check metadata getRaw method', async () => {
			if (result.metadata) {
				expect(typeof result.metadata.getRaw).toBe('function');
				const raw = result.metadata.getRaw();
				// getRaw returns the raw XML string or null
				expect(raw === null || typeof raw === 'string').toBe(true);
			}
		});

		test('should check metadata is iterable', async () => {
			if (result.metadata) {
				// Metadata implements Symbol.iterator
				expect(typeof result.metadata[Symbol.iterator]).toBe('function');
			}
		});
	});

	describe('Metadata Type compatibility tests', () => {
		test('metadata should implement Metadata', async () => {
			if (result.metadata) {
				const data: Metadata = result.metadata;
				expect(data.get).toBeDefined();
				expect(data.getRaw).toBeDefined();
			}
		});

		test('should be able to use result.metadata as Metadata', async () => {
			function processMetadata(data: Metadata): string {
				return data.get('dc:creator');
			}

			if (result.metadata) {
				const creator = processMetadata(result.metadata);
				expect(creator[0]).toBe('Mogush, Paul R');
			}
		});
	});

	describe('TextResult properties', () => {
		test('should have text property of type string', async () => {
			expect(result.text).toBeDefined();
			expect(typeof result.text).toBe('string');
			expect(result.text.length).toBeGreaterThan(0);
		});

		test('should have pages property as array', async () => {
			expect(result.pages).toBeDefined();
			expect(Array.isArray(result.pages)).toBe(true);
			expect(result.pages.length).toBeGreaterThan(0);
		});

		test('should have correct page structure', async () => {
			expect(result.pages.length).toBeGreaterThan(0);
			const firstPage = result.pages[0];
			expect(firstPage).toBeDefined();
			expect(typeof firstPage.num).toBe('number');
			expect(typeof firstPage.text).toBe('string');
			expect(firstPage.num).toBeGreaterThan(0);
		});

		test('should have getPageText method', async () => {
			expect(typeof result.getPageText).toBe('function');
		});

		test('getPageText should return correct text for valid page', async () => {
			const page1Text = result.getPageText(1);
			expect(typeof page1Text).toBe('string');
			expect(page1Text.length).toBeGreaterThan(0);
			// Should match the text from pages array
			const page1FromArray = result.pages.find((p) => p.num === 1);
			if (page1FromArray) {
				expect(page1Text).toBe(page1FromArray.text);
			}
		});

		test('getPageText should return empty string for invalid page', async () => {
			const invalidPageText = result.getPageText(99999);
			expect(invalidPageText).toBe('');
		});
	});

	describe('Type compatibility tests', () => {
		test('TextResult should implement InfoResult', async () => {
			// TextResult implements InfoResult, so it should have all InfoResult properties
			const infoResult: InfoResult = result;
			expect(infoResult.total).toBeDefined();
			expect(typeof infoResult.total).toBe('number');
		});

		test('should be able to use result as InfoResult', async () => {
			function processInfoResult(info: InfoResult): number {
				return info.total;
			}
			const total = processInfoResult(result);
			expect(total).toBe(result.total);
		});

		test('should be able to use result as TextResult', async () => {
			function processTextResult(textResult: TextResult): string {
				return textResult.text;
			}
			const text = processTextResult(result);
			expect(text).toBe(result.text);
		});
	});

	describe('Integration test', () => {
		test('should process all result properties correctly', async () => {
			// InfoResult properties
			expect(result.total).toBeGreaterThan(0);

			// TextResult properties
			expect(result.text.length).toBeGreaterThan(0);
			expect(result.pages.length).toBe(result.total);

			// Verify all pages
			for (let i = 1; i <= result.total; i++) {
				const pageText = result.getPageText(i);
				expect(pageText).toBeDefined();
				const pageFromArray = result.pages.find((p) => p.num === i);
				expect(pageFromArray).toBeDefined();
				expect(pageText).toBe(pageFromArray?.text);
			}
		});
	});
});

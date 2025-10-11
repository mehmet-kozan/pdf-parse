import { describe, expect, test } from 'vitest';
import { type InfoResult, type Metadata, PDFParse, type TextResult } from '../../src/index';

const URL_STR = 'https://bugzilla.mozilla.org/attachment.cgi?id=733434';

describe('InfoResult and TextResult Type Tests', async () => {
	const parser: PDFParse = new PDFParse({ url: new URL(URL_STR) });
	const infoResult: InfoResult = await parser.getInfo({ parseHyperlinks: true });
	const textResult: TextResult = await parser.getText({ parseHyperlinks: true });
	await parser.destroy();

	describe('InfoResult Properties', () => {
		test('should have total property of type number and be defined', async () => {
			expect(infoResult.total).toBeDefined();
			expect(typeof infoResult.total).toBe('number');
			expect(infoResult.total).toBeGreaterThan(0);
		});

		test('should have optional info property as object', async () => {
			if (infoResult.info) {
				expect(typeof infoResult.info).toBe('object');
				expect(infoResult.info).not.toBeNull();
			}
		});

		test('should have optional metadata property of type Metadata', async () => {
			if (infoResult.metadata) {
				expect(infoResult.metadata).toBeDefined();
				expect(typeof infoResult.metadata).toBe('object');
			}
		});
	});

	describe('Metadata Type Properties', () => {
		test('should have working get() method that returns correct type', async () => {
			if (infoResult.metadata) {
				expect(typeof infoResult.metadata.get).toBe('function');
				// Test common PDF metadata fields
				const title = infoResult.metadata.get('dc:title');
				// These fields may not exist but calling them should not throw
				expect(title === null || typeof title === 'string' || Array.isArray(title)).toBe(true);
			}
		});

		test('should have getRaw() method that returns raw XML string', async () => {
			if (infoResult.metadata) {
				expect(typeof infoResult.metadata.getRaw).toBe('function');
				const raw = infoResult.metadata.getRaw();
				// getRaw returns raw XML string or null
				expect(raw === null || typeof raw === 'string').toBe(true);
			}
		});

		test('should be iterable', async () => {
			if (infoResult.metadata) {
				// Metadata implements Symbol.iterator
				expect(typeof infoResult.metadata[Symbol.iterator]).toBe('function');
			}
		});
	});

	describe('Metadata Type Compatibility', () => {
		test('should implement Metadata type', async () => {
			if (infoResult.metadata) {
				const data: Metadata = infoResult.metadata;
				expect(data.get).toBeDefined();
				expect(data.getRaw).toBeDefined();
			}
		});

		test('should be usable as Metadata type in function parameters', async () => {
			function processMetadata(data: Metadata): string | null {
				const creator = data.get('dc:creator');
				return creator;
			}

			if (infoResult.metadata) {
				const creator = processMetadata(infoResult.metadata);
				// Creator can be string, array, or null
				expect(creator === null || typeof creator === 'string' || Array.isArray(creator)).toBe(true);
			}
		});
	});

	describe('TextResult Properties', () => {
		test('should have text property of type string with content', async () => {
			expect(textResult.text).toBeDefined();
			expect(typeof textResult.text).toBe('string');
			expect(textResult.text.length).toBeGreaterThan(0);
		});

		test('should have pages property as array containing pages', async () => {
			expect(textResult.pages).toBeDefined();
			expect(Array.isArray(textResult.pages)).toBe(true);
			expect(textResult.pages.length).toBeGreaterThan(0);
		});

		test('should have correct page structure with num and text properties', async () => {
			expect(textResult.pages.length).toBeGreaterThan(0);
			const firstPage = textResult.pages[0];
			expect(firstPage).toBeDefined();
			expect(typeof firstPage.num).toBe('number');
			expect(typeof firstPage.text).toBe('string');
			expect(firstPage.num).toBeGreaterThan(0);
		});

		test('should have getPageText method defined', async () => {
			expect(typeof textResult.getPageText).toBe('function');
		});

		test('should return correct text for valid page number via getPageText', async () => {
			const page1Text = textResult.getPageText(1);
			expect(typeof page1Text).toBe('string');
			expect(page1Text.length).toBeGreaterThan(0);
			// Should match the text from pages array
			const page1FromArray = textResult.pages.find((p) => p.num === 1);
			if (page1FromArray) {
				expect(page1Text).toBe(page1FromArray.text);
			}
		});

		test('should return empty string for invalid page number via getPageText', async () => {
			const invalidPageText = textResult.getPageText(99999);
			expect(invalidPageText).toBe('');
		});
	});

	describe('Type Compatibility and Usability', () => {
		test('should have total property in InfoResult', async () => {
			// InfoResult includes total property
			expect(infoResult.total).toBeDefined();
			expect(typeof infoResult.total).toBe('number');
		});

		test('should be usable as InfoResult in function parameters', async () => {
			function processInfoResult(info: InfoResult): number {
				return info.total;
			}
			const total = processInfoResult(infoResult);
			expect(total).toBe(infoResult.total);
		});

		test('should be usable as TextResult in function parameters', async () => {
			function processTextResult(result: TextResult): string {
				return result.text;
			}
			const text = processTextResult(textResult);
			expect(text).toBe(textResult.text);
		});

		test('should also have total property in TextResult', async () => {
			// TextResult also has total property but is not an InfoResult
			expect(textResult.total).toBeDefined();
			expect(typeof textResult.total).toBe('number');
		});
	});

	describe('Integration Tests', () => {
		test('should process all result properties correctly', async () => {
			// TextResult total page count
			expect(textResult.total).toBeGreaterThan(0);

			// TextResult text content
			expect(textResult.text.length).toBeGreaterThan(0);
			expect(textResult.pages.length).toBe(textResult.total);

			// Verify all pages
			for (let i = 1; i <= textResult.total; i++) {
				const pageText = textResult.getPageText(i);
				expect(pageText).toBeDefined();
				const pageFromArray = textResult.pages.find((p) => p.num === i);
				expect(pageFromArray).toBeDefined();
				expect(pageText).toBe(pageFromArray?.text);
			}
		});
	});
});

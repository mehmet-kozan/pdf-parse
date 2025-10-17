import { data } from '../helper/hyperlinks-test';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('test-space', async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getText({ parseHyperlinks: true });

	test('total page count must be correct', () => {
		expect(result.total).toEqual(data.total);
	});

	test.each(data.pages)('page: $num must contains test sentences', ({ num, texts }) => {
		const pageText = result.getPageText(num);

		for (const text of texts) {
			expect(pageText.includes(text)).toBeTruthy();
		}
	});

	test.each(data.pages)('all text must contains page $num all test sentences', ({ texts }) => {
		for (const text of texts) {
			expect(result.text?.includes(text)).toBeTruthy();
		}
	});
});

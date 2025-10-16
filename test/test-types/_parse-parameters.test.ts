import { describe, expect, test } from 'vitest';

import { type ParseParameters, PDFParse } from '../../src/index';

const URL_STR = 'https://bugzilla.mozilla.org/attachment.cgi?id=733434';

describe('ParseParameters Type Tests', async () => {
	test('partial should parse only specified pages', async () => {
		const parser = new PDFParse({ url: new URL(URL_STR) });
		const result = await parser.getText({ partial: [1] });
		await parser.destroy();

		expect(result).toBeDefined();
		expect(result.pages.length).toBe(1);
		expect(result.pages[0].num).toBe(1);
	});

	test('first should parse first N pages', async () => {
		const parser = new PDFParse({ url: new URL(URL_STR) });

		const params: ParseParameters = { first: 1 };
		const result = await parser.getText(params);
		await parser.destroy();

		expect(result).toBeDefined();
		expect(result.pages.length).toBe(1);
		expect(result.pages[0].num).toBe(1);
	});

	test('last should parse last N pages', async () => {
		const parser = new PDFParse({ url: new URL(URL_STR) });
		const resultAll = await parser.getText();
		// parse last page
		const lastN = 1;
		const result = await parser.getText({ last: lastN });
		await parser.destroy();

		expect(result).toBeDefined();
		expect(result.pages.length).toBe(lastN);
		// the page number of the single returned page should be equal to total
		expect(result.pages[0].num).toBe(resultAll.total);
	});

	test('first and last define inclusive range', async () => {
		const parser = new PDFParse({ url: new URL(URL_STR) });
		// parse only page 1..1 (page 1)
		const result = await parser.getText({ first: 1, last: 1 });
		await parser.destroy();

		expect(result).toBeDefined();
		expect(result.pages.length).toBe(1);
		expect(result.pages[0].num).toBe(1);
	});
});

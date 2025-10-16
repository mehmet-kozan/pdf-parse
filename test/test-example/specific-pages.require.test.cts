//const { data } = require ('../pdf_data/full-test.ts');

const { PDFParse } = require('pdf-parse');

import { describe, expect, test } from 'vitest';

const { readFileSync } = require('node:fs');
const { join } = require('node:path');

describe('test-parse-parameters', async () => {
	const buffer = readFileSync(join(__dirname, '../pdf_file/full-test.pdf'));
	const parser = new PDFParse({ data: buffer });

	// Parse only the first page (page 1):
	// - Request text extraction only for page 1 using the `partial` option.
	// - Verify that only one page is returned, that its page number is 1,
	//   and that the total page count in metadata matches the expected value.
	describe('parse only page 1', async () => {
		const result = await parser.getText({ partial: [1] });

		test('check result', async () => {
			expect(result.pages.length).toEqual(1);
			expect(result.pages[0].num).toEqual(1);
			expect(result.total).toEqual(14);
		});

		// test.each(result.pages)('page: $num must contains test sentences', ({ num, text }) => {
		// 	expect(text.includes(data.getFirstText(num))).toBeTruthy();
		// });
	});
});

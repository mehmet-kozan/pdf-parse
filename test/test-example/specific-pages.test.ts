import 'pdf-parse/worker';
import { PDFParse } from 'pdf-parse';

import { describe, expect, test } from 'vitest';
import { data } from '../pdf_data/full-test';

describe('test-parse-parameters', async () => {
	const buffer = await data.getBuffer();
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
			expect(result.total).toEqual(data.total);
		});

		test.each(result.pages)('page: $num must contains test sentences', ({ num, text }) => {
			expect(text.includes(data.getFirstText(num))).toBeTruthy();
		});
	});

	// Parse a selection of non-consecutive pages (pages 2, 5 and 7):
	// - Use the `partial` option to specify an explicit list of pages.
	// - Confirm that the returned pages are in the requested order and
	//   that each page's extracted text contains the expected sample text.
	describe('parse pages 2, 5, 7', async () => {
		const result = await parser.getText({ partial: [2, 5, 7] });

		test('check result', async () => {
			expect(result.pages.length).toEqual(3);
			expect(result.pages[0].num).toEqual(2);
			expect(result.pages[1].num).toEqual(5);
			expect(result.pages[2].num).toEqual(7);
			expect(result.total).toEqual(data.total);
		});

		test.each(result.pages)('page: $num must contains test sentences', ({ num, text }) => {
			expect(text.includes(data.getFirstText(num))).toBeTruthy();
		});
	});

	// Parse a contiguous page range (pages 5 through 8):
	// - Provide `first` and `last` to extract a continuous range of pages.
	// - Ensure the number of returned pages equals the range length and that
	//   the pages and their contents match expectations.
	describe('parse pages between 5-8', async () => {
		const result = await parser.getText({ first: 5, last: 8 });

		test('check result', async () => {
			expect(result.pages.length).toEqual(4);
			expect(result.pages[0].num).toEqual(5);
			expect(result.pages[1].num).toEqual(6);
			expect(result.pages[2].num).toEqual(7);
			expect(result.pages[3].num).toEqual(8);
			expect(result.total).toEqual(data.total);
		});

		test.each(result.pages)('page: $num must contains test sentences', ({ num, text }) => {
			expect(text.includes(data.getFirstText(num))).toBeTruthy();
		});
	});

	// Parse the first N pages (first 2 pages):
	// - Use `first` to request extraction starting from page 1 up to the given count.
	// - Verify the returned pages start at page 1 and include the expected texts.
	describe('parse first 2 pages', async () => {
		const result = await parser.getText({ first: 2 });

		test('check result', async () => {
			expect(result.pages.length).toEqual(2);
			expect(result.pages[0].num).toEqual(1);
			expect(result.pages[1].num).toEqual(2);
			expect(result.total).toEqual(data.total);
		});

		test.each(result.pages)('page: $num must contains test sentences', ({ num, text }) => {
			expect(text.includes(data.getFirstText(num))).toBeTruthy();
		});
	});

	// Parse the last N pages (last 2 pages):
	// - Use `last` to request extraction of the final N pages of the document.
	// - Confirm the pages returned correspond to the document's tail and that
	//   each contains the expected sample text for its page number.
	describe('parse last 2 pages', async () => {
		const result = await parser.getText({ last: 2 });

		test('check result', async () => {
			expect(result.pages.length).toEqual(2);
			expect(result.pages[0].num).toEqual(13);
			expect(result.pages[1].num).toEqual(14);
			expect(result.total).toEqual(data.total);
		});

		test.each(result.pages)('page: $num must contains test sentences', ({ num, text }) => {
			expect(text.includes(data.getFirstText(num))).toBeTruthy();
		});
	});
});

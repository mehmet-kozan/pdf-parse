import { data } from '../helper/simple-table';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe(data.fileName, async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getTable();
	test('table row col', () => {
		expect(result.total).toBe(data.total);
		expect(result.pages.length).toBe(1);

		expect(result.pages[0].tables[0].length).toBe(4);
	});

	test('table data', () => {
		expect(result.pages[0].tables[0]).toEqual(data.pages[0].tables[0]);
	});
});

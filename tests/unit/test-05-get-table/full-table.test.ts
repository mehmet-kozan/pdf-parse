import { data } from '../helper/full-table';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('test-10 empty table test', async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getTable();

	test('table row col', () => {
		expect(result.total).toBe(data.total);
		expect(result.pages.length).toBe(3);
		expect(result.pages[0].num).toBe(1);
		expect(result.pages[1].num).toBe(2);
		expect(result.pages[2].num).toBe(3);

		expect(result.pages[0].tables[0].length).toBe(23);
		expect(result.pages[1].tables[0].length).toBe(19);
		expect(result.pages[2].tables[0].length).toBe(4);
	});

	test('table data', () => {
		expect(result.pages[0].tables[0]).toEqual(data.pages[0].tables[0]);
		expect(result.pages[1].tables[0]).toEqual(data.pages[1].tables[0]);
		expect(result.pages[2].tables[0]).toEqual(data.pages[2].tables[0]);
	});
});

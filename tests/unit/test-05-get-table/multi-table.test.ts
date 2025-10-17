import { data } from '../helper/multi-table';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('test-10 empty table test', async () => {
	const buffer = await data.getBuffer();

	test('table must be equal', async () => {
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getTable();

		expect(result.pages.length).toBe(4);
		expect(result.pages[0].num).toBe(1);
		expect(result.pages[1].num).toBe(1);
		expect(result.pages[2].num).toBe(1);
		expect(result.pages[3].num).toBe(1);

		expect(result.pages[0].tables.length).toBe(4);
		expect(result.pages[1].tables.length).toBe(4);
		expect(result.pages[2].tables.length).toBe(4);
		expect(result.pages[3].tables.length).toBe(4);
	});
});

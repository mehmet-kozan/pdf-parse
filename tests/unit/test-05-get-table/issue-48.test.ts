import { data } from '../helper/issue-48';
import { PDFParse } from 'pdf-parse/pro';
import { describe, expect, test } from 'vitest';

describe(data.fileName, async () => {
	const buffer = await data.getBuffer();
	test('table data', async () => {
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getTable();
		expect(result.total).toBe(data.total);
		expect(result.pages[0].tables[0]).toEqual(data.pages[0].tables[0]);
	});
});

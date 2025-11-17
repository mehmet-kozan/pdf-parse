import { data } from '../helper/debug-issues-48';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe(data.fileName, async () => {
	const buffer = await data.getBuffer();
	test('table must be equal', async () => {
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getTable();
		expect(result.total).toBe(data.total);
	});
});

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);

describe('get-info page label number test', () => {
	test('pdf-page-label-number.pdf', async () => {
		const buffer = await readFile(join(__dir, 'pdf-page-label-number.pdf'));
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getInfo({ parseHyperlinks: true });
		expect(result.total).toEqual(5);
		expect(result.pages).toMatchObject([
			{
				pageNumber: 1,
				links: [],
				width: 595,
				height: 842,
				pageLabel: '362',
			},
			{
				pageNumber: 2,
				links: [],
				width: 595,
				height: 842,
				pageLabel: '363',
			},
			{
				pageNumber: 3,
				links: [],
				width: 595,
				height: 842,
				pageLabel: '364',
			},
			{
				pageNumber: 4,
				links: [],
				width: 595,
				height: 842,
				pageLabel: '365',
			},
			{
				pageNumber: 5,
				links: [],
				width: 595,
				height: 842,
				pageLabel: undefined,
			},
		]);
	});
});

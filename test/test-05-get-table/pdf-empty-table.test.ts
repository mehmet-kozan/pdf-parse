import { PDFParse } from '../../src/index';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, 'empty-table.pdf');

describe('test-10 empty table test', async () => {
	const data = await readFile(__pdf);

	test('table must be equal', async () => {
		const parser = new PDFParse({ data });
		const result = await parser.getTable();
		expect(result.pages.length).toBe(3);
		expect(result.pages[0].num).toBe(1);
		expect(result.pages[1].num).toBe(1);
		expect(result.pages[2].num).toBe(1);
		expect(result.pages[0].tables.length).toBe(4);
		expect(result.pages[1].tables.length).toBe(4);
		expect(result.pages[2].tables.length).toBe(4);
	});
});

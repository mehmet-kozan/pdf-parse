import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf_1 = join(__dirname, 'test-1.pdf');
const __pdf_2 = join(__dirname, 'test-2.pdf');

describe('test-01 pdf-text all:true', async () => {
	const data1 = await readFile(__pdf_1);
	const parser1 = new PDFParse({ data: data1 });

	test('total page count must be correct for multiple pdf files-1', async () => {
		const res1 = await parser1.getText();
		expect(res1.total).toEqual(14);
		expect(res1.total).toEqual(res1.pages.length);
	});

	const data2 = await readFile(__pdf_2);
	const parser2 = new PDFParse({ data: data2 });

	test('total page count must be correct for multiple pdf files-2', async () => {
		const res2 = await parser2.getText();
		expect(res2.total).toEqual(35);
		expect(res2.total).toEqual(res2.pages.length);
	});
});

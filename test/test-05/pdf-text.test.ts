import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';
import { TestData } from './data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, 'test.pdf');
const __pdf_txt = join(__dirname, 'test.txt');

describe('test-05 all:true', async () => {
	const data = readFileSync(__pdf);
	const parser = new PDFParse({ data });
	const result_05 = await parser.getText();

	writeFileSync(__pdf_txt, result_05.text, {
		encoding: 'utf8',
		flag: 'w',
	});

	test('total page count must be correct', () => {
		expect(result_05.total).toEqual(TestData.total);
	});

	test.each(TestData.pages)('page: $num must contains test sentences', ({ num, texts }) => {
		const pageText = result_05.getPageText(num);

		for (const text of texts) {
			expect(pageText.includes(text)).toBeTruthy();
		}
	});

	test.each(TestData.pages)('all text must contains page $num all test sentences', ({ texts }) => {
		for (const text of texts) {
			expect(result_05.text?.includes(text)).toBeTruthy();
		}
	});
});

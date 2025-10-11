import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';
import { TestData } from './data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, '../pdf_files/password-123456.pdf');
const __pdf_txt = join(__dirname, 'test.txt');

describe('test-06-password all:true', async () => {
	const data = await readFile(__pdf);
	const parser = new PDFParse({ data, password: TestData.password });
	const result_06 = await parser.getText();

	await writeFile(__pdf_txt, result_06.text, { encoding: 'utf8', flag: 'w' });

	test('total page count must be correct', () => {
		expect(result_06.total).toEqual(TestData.total);
	});

	test.each(TestData.pages)('page: $num must contains test sentences', ({ num, texts }) => {
		const pageText = result_06.getPageText(num);

		for (const text of texts) {
			expect(pageText.includes(text)).toBeTruthy();
		}
	});

	test.each(TestData.pages)('all text must contains page $num all test sentences', ({ texts }) => {
		for (const text of texts) {
			expect(result_06.text?.includes(text)).toBeTruthy();
		}
	});
});

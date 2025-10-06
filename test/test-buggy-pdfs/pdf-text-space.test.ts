import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';
import { TestData } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, 'PROTECCION-DE-LA-VIVIENDA-UNICA-E-INSCRIPCION-REGISTRAL---Mazzei.pdf');
const __pdf_txt = join(__dirname, 'PROTECCION-DE-LA-VIVIENDA-UNICA-E-INSCRIPCION-REGISTRAL---Mazzei.txt');

describe('test-space', async () => {
	const data = await readFile(__pdf);
	const buffer = new Uint8Array(data);
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getText();
	

	await writeFile(__pdf_txt, result.text, {
		encoding: 'utf8',
		flag: 'w',
	});

	test('total page count must be correct', () => {
		expect(result.total).toEqual(TestData.total);
	});

	test.each(TestData.pages)('page: $num must contains test sentences', ({ num, texts }) => {
		const pageText = result.getPageText(num);

		for (const text of texts) {
			expect(pageText.includes(text)).toBeTruthy();
		}
	});

	test.each(TestData.pages)('all text must contains page $num all test sentences', ({ texts }) => {
		for (const text of texts) {
			expect(result.text?.includes(text)).toBeTruthy();
		}
	});
});

import { readFile, writeFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';
import { TestData } from './data.js';

const __pdf = `${import.meta.dirname}/test.pdf`;
const __pdf_txt = `${import.meta.dirname}/test.txt`;

describe('test-02 all:true', async () => {
	const data = await readFile(__pdf);
	const buffer = new Uint8Array(data);
	const parser = new PDFParse({ data: buffer });
	const result = await parser.GetText();

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

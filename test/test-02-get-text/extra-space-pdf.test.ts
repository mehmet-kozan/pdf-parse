import { PDFParse } from '../../src/index';
import { data } from '../pdf_data/extra-space';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const __pdf_txt = join(__dirname, data.textFile);

describe(`${data.fileName} test all:true`, async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getText();

	writeFileSync(__pdf_txt, result.text, {
		encoding: 'utf8',
		flag: 'w',
	});

	test('total page count must be correct', () => {
		expect(result.total).toEqual(data.total);
	});

	test.each(data.pages)('page: $num must contains test sentences', ({ num, texts }) => {
		const pageText = result.getPageText(num);

		for (const text of texts) {
			expect(pageText.includes(text)).toBeTruthy();
		}
	});

	test.each(data.pages)('all text must contains page $num all test sentences', ({ texts }) => {
		for (const text of texts) {
			expect(result.text?.includes(text)).toBeTruthy();
		}
	});
});

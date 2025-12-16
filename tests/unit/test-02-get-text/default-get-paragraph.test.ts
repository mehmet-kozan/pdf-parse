import { data } from '../helper/default-test';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFParse } from 'pdf-parse/pro';
import { describe, expect, test } from 'vitest';

describe(`${data.fileName} get-paragraph`, async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getParagraph();

	await writeFile(join(__dirname, `${data.fileName}.paragraph.txt`), result, {
		encoding: 'utf8',
		flag: 'w',
	});

	test('total page count must be correct', () => {
		expect(14).toEqual(data.total);
	});

	// test.each(data.pages)('page: $num must contains test sentences', ({ num, texts }) => {
	// 	const pageText = result.getPageText(num);

	// 	for (const text of texts) {
	// 		expect(pageText.includes(text)).toBeTruthy();
	// 	}
	// });

	// test.each(data.pages)('all text must contains page $num all test sentences', ({ texts }) => {
	// 	for (const text of texts) {
	// 		expect(result.text?.includes(text)).toBeTruthy();
	// 	}
	// });
});

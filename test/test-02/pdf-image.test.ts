import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';
import { TestData } from './data.js';

const __pdf = `${import.meta.dirname}/test.pdf`;
const __pdf_imgs = `${import.meta.dirname}/imgs`;
await mkdir(__pdf_imgs, { recursive: true });

describe('test-01 pdf-image all:true', async () => {
	const data = await readFile(__pdf);
	const buffer = new Uint8Array(data);
	const parser = new PDFParse({ data: buffer });
	const result = await parser.GetImage();

	for (const pageData of result.pages) {
		for (const pageImage of pageData.images) {
			await writeFile(`${__pdf_imgs}/page_${pageData.pageNumber}-${pageImage.fileName}.png`, pageImage.data, {
				flag: 'w',
			});
		}
	}

	test('total page count must be correct', () => {
		expect(result.total).toEqual(TestData.total);
	});
});

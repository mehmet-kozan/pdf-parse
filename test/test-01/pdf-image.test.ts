import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';
import { TestData } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, 'test.pdf');
const __pdf_imgs = join(__dirname, 'imgs');
await mkdir(__pdf_imgs, { recursive: true });

describe('test-01 pdf-image all:true', async () => {
	const data = await readFile(__pdf);
	const buffer = new Uint8Array(data);
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getImage();

	for (const pageData of result.pages) {
		for (const pageImage of pageData.images) {
			const imgFileName = `page_${pageData.pageNumber}-${pageImage.fileName}.png`;
			const imgPath = join(__pdf_imgs, imgFileName);
			await writeFile(imgPath, pageImage.data, {
				flag: 'w',
			});
		}
	}

	test('total page count must be correct', () => {
		expect(result.total).toEqual(TestData.total);
	});
});

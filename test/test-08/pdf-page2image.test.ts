import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';
import { TestData } from './data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, 'compressed.tracemonkey-pldi-09.pdf');
const __pdf_imgs = join(__dirname, 'imgs');
await mkdir(__pdf_imgs, { recursive: true });

describe('test-07 pdf-image all:true', async () => {
	const data = await readFile(__pdf);
	const parser = new PDFParse({ data });
	const imageResult = await parser.PageToImage();

	test('total page count must be correct', () => {
		expect(imageResult.total).toEqual(TestData.total);
	});

	for (const pageData of imageResult.pages) {
		const imgFileName = `page_${pageData.pageNumber}.png`;
		const imgPath = join(__pdf_imgs, imgFileName);
		await writeFile(imgPath, pageData.data, {
			flag: 'w',
		});
	}

	// test.each(TestData.pages)('page: $num must contains exact base64 image', ({ num, imgs }) => {
	// 	if (imgs) {
	// 		for (const img of imgs) {
	// 			const pageImg = imageResult.getPageImage(num, img.name);
	// 			expect(pageImg?.dataUrl).toBe(img.dataUrl);
	// 		}
	// 	}
	// });
});

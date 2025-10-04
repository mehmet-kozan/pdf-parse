import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';
import { TestData } from './data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, 'test.pdf');
const __pdf_txt = join(__dirname, 'test.txt');
const __pdf_imgs = join(__dirname, 'imgs');
await mkdir(__pdf_imgs, { recursive: true });

describe('test-07 pdf-image all:true', async () => {
	const data = await readFile(__pdf);
	const parser = new PDFParse({ data });

	const textResult = await parser.getText();

	const imageResult = await parser.getImage();

	await writeFile(__pdf_txt, textResult.text, { encoding: 'utf8', flag: 'w' });

	test('total page count must be correct', () => {
		expect(textResult.total).toEqual(TestData.total);
	});

	for (const pageData of imageResult.pages) {
		for (const pageImage of pageData.images) {
			const imgFileName = `page_${pageData.pageNumber}-${pageImage.fileName}.png`;
			const imgPath = join(__pdf_imgs, imgFileName);
			await writeFile(imgPath, pageImage.data, {
				flag: 'w',
			});
		}
	}

	test.each(TestData.pages)('page: $num must contains exact base64 image', ({ num, imgs }) => {
		if (imgs) {
			for (const img of imgs) {
				const pageImg = imageResult.getPageImage(num, img.name);
				expect(pageImg?.dataUrl).toBe(img.dataUrl);
			}
		}
	});
});

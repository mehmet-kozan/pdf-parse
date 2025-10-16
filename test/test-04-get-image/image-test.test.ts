import { data } from '../pdf_data/image-test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

const __pdf_imgs = join(__dirname, data.imageFolder);
await mkdir(__pdf_imgs, { recursive: true });

describe('test-07 pdf-image all:true', async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });

	const textResult = await parser.getText();

	const imageResult = await parser.getImage();

	await writeFile(join(__dirname, data.textFile), textResult.text, { encoding: 'utf8', flag: 'w' });

	test('total page count must be correct', () => {
		expect(textResult.total).toEqual(data.total);
	});

	for (const pageData of imageResult.pages) {
		for (const pageImage of pageData.images) {
			const imgFileName = `page_${pageData.pageNumber}-${pageImage.name}.png`;
			const imgPath = join(__pdf_imgs, imgFileName);
			await writeFile(imgPath, pageImage.data, {
				flag: 'w',
			});
		}
	}

	test.each(data.pages)('page: $num must contains exact base64 image', ({ num, imgs }) => {
		if (imgs) {
			for (const img of imgs) {
				const pageImg = imageResult.getPageImage(num, img.name);
				expect(pageImg?.dataUrl).toBe(img.dataUrl);
			}
		}
	});
});

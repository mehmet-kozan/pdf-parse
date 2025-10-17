import { data } from '../pdf_data/solar-energy';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

const folder = join(__dirname, data.imageFolder);
await mkdir(folder, { recursive: true });

describe('test-01 pdf-image all:true', async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getImage();

	for (const pageData of result.pages) {
		for (const pageImage of pageData.images) {
			const imgFileName = `page_${pageData.pageNumber}-${pageImage.name}.png`;
			const imgPath = join(folder, imgFileName);
			await writeFile(imgPath, pageImage.data, {
				flag: 'w',
			});
		}
	}

	test.each(data.pages)('page: $num must contains exact base64 image', ({ num, imgs }) => {
		if (imgs) {
			for (const img of imgs) {
				const pageImg = result.getPageImage(num, img.name);
				expect(pageImg?.dataUrl).toBe(img.dataUrl);
			}
		}
	});

	test('total page count must be correct', () => {
		expect(result.total).toEqual(data.total);
	});
});

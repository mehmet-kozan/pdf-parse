import { data } from '../helper/solar-energy';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

const folder = join(__dirname, data.imageFolder);
await mkdir(folder, { recursive: true });

describe(data.fileName, async () => {
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

				// Fix: createHash requires BinaryLike; ensure we only hash when dataUrl is a string.
				const dataUrl = pageImg?.dataUrl || '';
				const dataHash = createHash('md5').update(dataUrl).digest('hex');
				expect(dataHash).toBe(img.dataHash);
			}
		}
	});

	test('total page count must be correct', () => {
		expect(result.total).toEqual(data.total);
	});
});

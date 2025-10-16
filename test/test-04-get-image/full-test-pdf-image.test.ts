import { data } from '../pdf_data/full-test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { PDFParse } from '../../src/index';

const folder = join(__dirname, data.imageFolder);
await mkdir(folder, { recursive: true });

describe(`${data.fileName} pdf-image all:true`, async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getImage({ imageThreshold: 80 });

	for (const pageData of result.pages) {
		for (const pageImage of pageData.images) {
			const imgFileName = `page_${pageData.pageNumber}-${pageImage.name}.png`;
			const imgPath = join(folder, imgFileName);
			await writeFile(imgPath, pageImage.data, {
				flag: 'w',
			});
		}
	}

	test('total page count must be correct', () => {
		expect(result.total).toEqual(data.total);
	});

	test('total image count must be zero', async () => {
		let total = 0;
		for (const pageData of result.pages) {
			total += pageData.images.length;
		}

		expect(total).toEqual(0);
	});
});

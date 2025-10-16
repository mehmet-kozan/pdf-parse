import { data } from '../pdf_data/full-test';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { PDFParse, type ScreenshotResult } from '../../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const folder = join(__dirname, data.imageFolder);
await mkdir(folder, { recursive: true });

describe(`${data.fileName} screenshot test`, async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result: ScreenshotResult = await parser.getScreenshot({ scale: 2 });

	for (const pageData of result.pages) {
		const fileName = `page_${pageData.pageNumber}.png`;
		const filePath = join(folder, fileName);
		await writeFile(filePath, pageData.data, {
			flag: 'w',
		});
	}

	test('totat page test', () => {
		expect(result.total).toEqual(data.total);
	});

	// test.each(TestData.pages)('page: $num must contains exact base64 image', ({ num, imgs }) => {
	// 	if (imgs) {
	// 		for (const img of imgs) {
	// 			const pageImg = imageResult.getPageImage(num, img.name);
	// 			expect(pageImg?.dataUrl).toBe(img.dataUrl);
	// 		}
	// 	}
	// });
});

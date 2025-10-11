import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';
import { data } from '../pdf_files/full-test';

describe(`${data.fileName} pdf-image all:true`, async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getImage({ minImageHeight: 100, minImageWidth: 100 });

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

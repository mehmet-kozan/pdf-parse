import { data } from '../helper/label-test';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('get-info page label number test', () => {
	test('pdf-page-label-number.pdf', async () => {
		const buffer = await data.getBuffer();
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getInfo({ parsePageInfo: true });
		expect(result.total).toEqual(data.total);
		expect(result.pages).toMatchObject(data.infos);
	});
});

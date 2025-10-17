import { data as data01 } from '../helper/default-test';
import { data as data02 } from '../helper/vite';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('memory-leak test', async () => {
	const buffer01 = await data01.getBuffer();
	const parser1 = new PDFParse({ data: buffer01 });

	test('total page count must be correct for multiple pdf files-1', async () => {
		const res1 = await parser1.getText();
		expect(res1.total).toEqual(data01.total);
		expect(res1.total).toEqual(res1.pages.length);
	});

	const buffer02 = await data02.getBuffer();
	const parser2 = new PDFParse({ data: buffer02 });

	test('total page count must be correct for multiple pdf files-2', async () => {
		const res2 = await parser2.getText();
		expect(res2.total).toEqual(data02.total);
		expect(res2.total).toEqual(res2.pages.length);
	});
});

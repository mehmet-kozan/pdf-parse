import { data as bug } from '../helper/bug';
import { data as invalid } from '../helper/invalid';
import { type InvalidPDFException, PDFParse } from 'pdf-parse';
//import * as util from 'pdfjs-dist/types/src/shared/util.js';
import { describe, expect, test } from 'vitest';

describe('test invalid pdfs', async () => {
	const buffer = await invalid.getBuffer();

	test(invalid.fileName, async () => {
		try {
			const parser = new PDFParse({ data: buffer });
			await parser.getText();
		} catch (error) {
			expect((error as Error).name).toEqual('InvalidPDFException');
			expect((error as InvalidPDFException).message).toEqual('Invalid PDF structure.');
		}
	});

	test(bug.fileName, async () => {
		try {
			const buffer = await bug.getBuffer();
			const parser = new PDFParse({ data: buffer });
			await parser.getText();
		} catch (error) {
			//expect(error instanceof util.InvalidPDFException).toEqual(true);
			expect((error as InvalidPDFException).message).toEqual('Invalid PDF structure.');
		}
	});
});

import { data as bug } from '../helper/bug';
import { data as invalid } from '../helper/invalid';
import { InvalidPDFException, PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('test invalid pdfs', async () => {
	const buffer = await invalid.getBuffer();

	test(invalid.fileName, async () => {
		try {
			const parser = new PDFParse({ data: buffer });
			await parser.getText();
		} catch (error) {
			expect(error instanceof InvalidPDFException).toEqual(true);
			expect((error as InvalidPDFException).message).toEqual('Invalid PDF structure.');
		}
	});

	test(bug.fileName, async () => {
		try {
			const buffer = await bug.getBuffer();
			const parser = new PDFParse({ data: buffer });
			await parser.getText();
		} catch (error) {
			expect(error instanceof InvalidPDFException).toEqual(true);
			expect((error as InvalidPDFException).message).toEqual('Invalid PDF structure.');
		}
	});
});

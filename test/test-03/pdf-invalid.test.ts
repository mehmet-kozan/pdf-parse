import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { InvalidPDFException } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, 'test.pdf');

describe('test-03 invalid pdf file', async () => {
	const data = await readFile(__pdf);

	test('should throw error from invalid PDF file: test.pdf', async () => {
		try {
			const parser = new PDFParse({ data });
			await parser.getText();
		} catch (error) {
			expect(error instanceof InvalidPDFException).toEqual(true);
			expect((error as InvalidPDFException).message).toEqual('Invalid PDF structure.');
		}
	});

	test('should throw error from invalid PDF file: bug1020226.pdf', async () => {
		try {
			const data = await readFile(join(__dirname, 'bug1020226.pdf'));
			const buffer = new Uint8Array(data);
			const parser = new PDFParse({ data: buffer });
			await parser.getText();
		} catch (error) {
			expect(error instanceof InvalidPDFException).toEqual(true);
			expect((error as InvalidPDFException).message).toEqual('Invalid PDF structure.');
		}
	});
});

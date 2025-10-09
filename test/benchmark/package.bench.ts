import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import PDF2JSON from 'pdf2json';
import { bench, describe } from 'vitest';
import { PDFParse as BrowserPDFParse } from '../../dist/browser/pdf-parse.es.min.js';
import pdf from '../../dist/cjs/index.cjs';
import { PDFParse } from '../../dist/esm/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __pdf = join(__dirname, 'bench.pdf');

async function pdf_parse_esm_promise(buffer: Buffer<ArrayBufferLike>) {
	const parser = new PDFParse({ data: buffer });

	await parser.getText();
	await parser.destroy();
}

async function pdf_parse_cjs_promise(buffer: Buffer<ArrayBufferLike>) {
	await pdf(buffer);
}

async function pdf_parse_browser_promise(buffer: Buffer<ArrayBufferLike>) {
	const parser = new BrowserPDFParse({ data: buffer });
	await parser.getText();
	await parser.destroy();
}

async function pdf2json_promise(buffer: Buffer<ArrayBufferLike>) {
	const parser = new PDF2JSON();

	return new Promise((resolve, reject) => {
		parser.on('pdfParser_dataError', () => reject());
		parser.on('pdfParser_dataReady', (pdfData) => resolve(pdfData));
		parser.parseBuffer(buffer);
	});
}

describe('Parsing Files', async () => {
	const data = await readFile(__pdf);
	bench(
		'pdf-parse esm build',
		async () => {
			await pdf_parse_esm_promise(data);
		},
		{ iterations: 50 },
	);

	bench(
		'pdf-parse cjs build',
		async () => {
			await pdf_parse_cjs_promise(data);
		},
		{ iterations: 50 },
	);

	bench(
		'pdf-parse browser build',
		async () => {
			await pdf_parse_browser_promise(data);
		},
		{ iterations: 50 },
	);

	bench(
		'pdf2json',
		async () => {
			await pdf2json_promise(data);
		},
		{ iterations: 50 },
	);
});

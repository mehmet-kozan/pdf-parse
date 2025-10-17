import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import PDF2JSON from 'pdf2json';
import { bench, describe } from 'vitest';

import { PDFParse as BrowserPDFParse } from '../../../dist/browser/pdf-parse.es.min.js';
import { PDFParse as PDFParseCJS } from '../../../dist/cjs/index.cjs';
import { PDFParse } from '../../../dist/esm/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __pdf = join(__dirname, '../../../reports/pdf/solar-energy.pdf');

async function pdf_parse_esm_promise(buffer: Uint8Array) {
	const parser = new PDFParse({ data: buffer });

	await parser.getText();
	await parser.destroy();
}

async function pdf_parse_cjs_promise(buffer: Uint8Array) {
	const parser = new PDFParseCJS({ data: buffer });

	await parser.getText();
	await parser.destroy();
}

async function pdf_parse_browser_promise(buffer: Uint8Array) {
	const parser = new BrowserPDFParse({ data: buffer });
	await parser.getText();
	await parser.destroy();
}

async function pdf2json_promise(buffer: Buffer<ArrayBufferLike>) {
	const parser = new PDF2JSON();
	process.env.PDF2JSON_DISABLE_LOGS = '1';

	return new Promise((resolve, reject) => {
		parser.on('pdfParser_dataError', () => reject());
		parser.on('pdfParser_dataReady', (pdfData) => {
			parser.destroy();
			resolve(pdfData);
		});

		parser.parseBuffer(buffer, 0);
	});
}

describe('Parsing Files', async () => {
	const data = await readFile(__pdf);
	const buffer = new Uint8Array(data);
	bench(
		'pdf-parse esm build',
		async () => {
			await pdf_parse_esm_promise(new Uint8Array(buffer));
		},
		{ iterations: 10 },
	);

	bench(
		'pdf-parse cjs build',
		async () => {
			await pdf_parse_cjs_promise(new Uint8Array(buffer));
		},
		{ iterations: 10 },
	);

	bench(
		'pdf-parse browser build',
		async () => {
			await pdf_parse_browser_promise(new Uint8Array(buffer));
		},
		{ iterations: 10 },
	);

	bench(
		'pdf2json',
		async () => {
			await pdf2json_promise(Buffer.from(buffer));
		},
		{ iterations: 10 },
	);
});

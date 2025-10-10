/** biome-ignore-all lint/suspicious/noConsole: <test file> */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse as PDFParseRemote } from 'pdf-parse';
import { PDFParse as PDFParseLocal } from '../../dist/esm/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, 'dummy.pdf');

async function run() {
	try {
		const buffer = await readFile(__pdf);
		const remote_buffer = new Uint8Array(buffer);
		const local_buffer = new Uint8Array(buffer);

		const remote_parser = new PDFParseRemote({ data: remote_buffer });
		const local_parser = new PDFParseLocal({ data: local_buffer });

		const remote_data = await remote_parser.getText();
		const local_data = await local_parser.getText();

		await remote_parser.destroy();
		await local_parser.destroy();

		if (remote_data.text.includes('Dummy PDF file') && local_data.text.includes('Dummy PDF file')) {
			process.exit(0);
		}
		process.exit(1);
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}

run();

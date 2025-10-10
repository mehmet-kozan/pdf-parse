/** biome-ignore-all lint/suspicious/noConsole: <test file> */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, 'dummy.pdf');

async function run() {
	try {
		const buffer = await readFile(__pdf);
		const parser = new PDFParse({ data: buffer });
		const data = await parser.getText();

		await parser.destroy();

		if (data.text.includes('Dummy PDF file')) {
			process.exit(0);
		}
		process.exit(1);
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}

run();

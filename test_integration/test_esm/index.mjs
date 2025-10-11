/** biome-ignore-all lint/suspicious/noConsole: <test file> */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __pdf_files = join(__dirname, '../../test/pdf_files');

async function run() {
	try {
		let buffer = await readFile(join(__pdf_files, 'dummy-test.pdf'));
		let parser = new PDFParse({ data: buffer });
		let result = await parser.getText();
		await parser.destroy();

		if (!result.text.includes('Dummy PDF file')) {
			process.exit(1);
		}

		buffer = await readFile(join(__pdf_files, 'full-test.pdf'));
		parser = new PDFParse({ data: buffer });
		result = await parser.getText({ last: 1 });
		await parser.destroy();

		if (!result.text.includes('be interpreted as necessarily')) {
			process.exit(1);
		}

		buffer = await readFile(join(__pdf_files, 'image-test.pdf'));
		parser = new PDFParse({ data: buffer });
		const img_result = await parser.getImage();
		const ss_result = await parser.getScreenshot();

		await parser.destroy();

		if (img_result.pages[0].images[0].dataUrl.length <= 0) {
			process.exit(1);
		}

		if (ss_result.pages[0].dataUrl.length <= 0) {
			process.exit(1);
		}

		process.exit(0);
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}

run();

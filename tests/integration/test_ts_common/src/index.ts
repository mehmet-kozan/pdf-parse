/** biome-ignore-all lint/suspicious/noConsole: <test file> */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type PageTextResult, PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __pdf = join(__dirname, '../../../../reports/pdf/');

const dataBuffer = await readFile(join(__pdf, 'default-test.pdf'));

const parser = new PDFParse({ data: dataBuffer });

function test(res: PageTextResult) {
	if (res.text.includes('Trace-based Just-in-Time Type Specialization') && res.num === 1) {
		process.exit(0);
	} else {
		process.exit(1);
	}
}

const result = await parser.getText();
test(result.pages[0]);

/** biome-ignore-all lint/suspicious/noConsole: <example code> */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../reports/pdf/default-test.pdf');
const buffer = await fs.readFile(filePath);

const parser = new PDFParse({ data: buffer });
try {
	const result = await parser.getText();
	console.log(result.text);
} catch (error) {
	console.error('PDF parsing failed:', error);
} finally {
	await parser.destroy();
}

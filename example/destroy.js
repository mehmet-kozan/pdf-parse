/** biome-ignore-all lint/suspicious/noConsole: <example code> */

import { PDFParse } from '../dist/esm/index.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../test/pdf_file/full-test.pdf');
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

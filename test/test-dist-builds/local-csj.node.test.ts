import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

require('pdf-parse/worker');
const { PDFParse } = require('pdf-parse/node');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('test-dist local cjs test', async () => {
	test('default export', async () => {
		const file = path.join(__dirname, '../pdf_file/full-test.pdf');
		const data = fs.readFileSync(file);

		const parser = new PDFParse({ data });
		const result = await parser.getText();

		expect(result.text).toBeTruthy();
	});
});

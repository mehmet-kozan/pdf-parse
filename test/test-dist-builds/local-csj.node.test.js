import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const { PDFParse } = require('../../dist/node/index.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('test-dist local cjs test', async () => {
	test('default export', async () => {
		const file = path.join(__dirname, 'test.pdf');
		const data = fs.readFileSync(file);

		const parser = new PDFParse({ data });
		const result = await parser.getText();

		expect(result.text).toBeTruthy();
	});
});

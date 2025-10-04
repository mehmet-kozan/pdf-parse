import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { PDFParse, pdf } from '../../';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('test-dist local cjs test', async () => {
	test('default export', async () => {
		const file = path.join(__dirname, 'test.pdf');
		const data = fs.readFileSync(file);

		const result1 = await pdf(data);
		expect(result1.text).toBeTruthy();

		const parser = new PDFParse({ data });
		const result2 = await parser.getText();

		expect(result2.text).toBeTruthy();

		expect(result1.text).toBe(result2.text);
	});
});

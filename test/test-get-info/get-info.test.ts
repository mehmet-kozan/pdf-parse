import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, 'test.pdf');

describe('test-01 get-info test', async () => {
	const buffer = await readFile(__pdf);
	const parser = new PDFParse({ data: buffer });

	test('test total page count must be correct', async () => {
		const info = await parser.getInfo();
		expect(info.total).toEqual(14);
	});
});

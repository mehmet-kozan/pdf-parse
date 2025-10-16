import { PDFParse } from '../../src/index';
import { TestData } from './data.js';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf_working = join(__dirname, 'working.pdf');
const __pdf_working_text = join(__dirname, 'working.txt');
const __pdf_non_working = join(__dirname, 'non-working.pdf');
const __pdf_non_working_txt = join(__dirname, 'non-working.txt');

describe('text table working test', async () => {
	const buffer = await readFile(__pdf_working);
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getText({ partial: [2] });

	await writeFile(__pdf_working_text, result.text, {
		encoding: 'utf8',
		flag: 'w',
	});

	test('total page count must be correct', () => {
		expect(result.total).toEqual(TestData.working.total);
	});

	test.each(TestData.working.texts)('all text must contains page test sentences', (texts) => {
		for (const text of texts) {
			expect(result.text?.includes(text)).toBeTruthy();
		}
	});
});

describe('text table non-working test', async () => {
	const buffer = await readFile(__pdf_non_working);
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getText({ partial: [1], cellSeparator: '#', lineEnforce: true });

	await writeFile(__pdf_non_working_txt, result.text, {
		encoding: 'utf8',
		flag: 'w',
	});

	//91 sharp
	test('total page count must be correct', () => {
		expect(result.total).toEqual(TestData.nonworking.total);
	});

	test('total sharp count must be correct', () => {
		const count = (result.text.match(/#/g) || []).length;
		expect(count).toEqual(TestData.nonworking.sharp);
	});

	test.each(TestData.nonworking.texts)('all text must contains page test sentences', (texts) => {
		for (const text of texts) {
			expect(result.text?.includes(text)).toBeTruthy();
		}
	});
});

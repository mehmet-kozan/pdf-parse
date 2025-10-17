import { data } from '../helper/text-table-working.js';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe(data.fileName, async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getText({ partial: [2] });

	await writeFile(join(__dirname, data.textFile), result.text, {
		encoding: 'utf8',
		flag: 'w',
	});

	test('total page count must be correct', () => {
		expect(result.total).toEqual(data.total);
	});
});

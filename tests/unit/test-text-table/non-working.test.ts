import { data } from '../helper/text-table-non-working.js';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe(data.fileName, async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getText({ partial: [1], cellSeparator: '#', lineEnforce: true });

	await writeFile(join(__dirname, data.textFile), result.text, {
		encoding: 'utf8',
		flag: 'w',
	});

	//91 sharp
	test('total page count must be correct', () => {
		expect(result.total).toEqual(data.total);
	});

	test('total sharp count must be correct', () => {
		const count = (result.text.match(/#/g) || []).length;
		expect(count).toEqual(data.pages[0].seperatorCount);
	});
});

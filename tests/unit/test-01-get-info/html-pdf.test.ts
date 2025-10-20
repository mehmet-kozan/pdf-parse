import { data } from '../helper/html';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe(data.fileName, async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getText();

	writeFileSync(join(__dirname, data.textFile), result.text, {
		encoding: 'utf8',
		flag: 'w',
	});

	test('total page count', () => {
		expect(result.total).toEqual(data.total);
	});

	test('total title info', async () => {
		const result = await parser.getInfo();
		expect(result.info.Title).toEqual('Sodalitas delectus ipsum aperio facere. - test-automation - Confluence');
	});
});

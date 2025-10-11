import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';
import { data } from '../pdf_files/password-123456';

describe('load password protected pdf', async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer, password: '123456' });
	const infoResult = await parser.getInfo();
	const textResult = await parser.getText();

	test('results be correct', () => {
		expect(infoResult.total).toEqual(2);
		expect(infoResult.info.PDFFormatVersion).toEqual('1.7');
		expect(textResult.total).toEqual(2);
		expect(textResult.text).toContain('Welcome to Adobe Acrobat');
	});
});

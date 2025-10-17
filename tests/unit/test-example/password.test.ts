import { PDFParse, VerbosityLevel } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

import { data } from '../helper/password-123456';

describe('load password protected pdf', async () => {
	const buffer = await data.getBuffer();
	const parser = new PDFParse({ data: buffer, password: '123456', verbosity: VerbosityLevel.WARNINGS });
	const infoResult = await parser.getInfo();
	const textResult = await parser.getText();

	test('results be correct', () => {
		expect(infoResult.total).toEqual(2);
		expect(infoResult.info.PDFFormatVersion).toEqual('1.7');
		expect(textResult.total).toEqual(2);
		expect(textResult.text).toContain('Welcome to Adobe Acrobat');
	});
});

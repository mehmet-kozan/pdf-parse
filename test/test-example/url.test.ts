import { describe, expect, test } from 'vitest';
import { PDFParse } from '../../src/index';

describe('test-load url string', async () => {
	const parser = new PDFParse({ url: 'https://bugzilla.mozilla.org/attachment.cgi?id=733434' });
	const infoResult = await parser.getInfo();
	const textResult = await parser.getText();
	test('results be correct', () => {
		expect(infoResult.total).toEqual(9);
		expect(infoResult.info.PDFFormatVersion).toEqual('1.7');
		expect(textResult.total).toEqual(9);
		expect(textResult.text).toContain('BMCL Digest');
	});
});

describe('test-load url object', async () => {
	const parser = new PDFParse({ url: new URL('https://bugzilla.mozilla.org/attachment.cgi?id=733434') });
	const infoResult = await parser.getInfo();
	const textResult = await parser.getText();
	test('results be correct', () => {
		expect(infoResult.total).toEqual(9);
		expect(infoResult.info.PDFFormatVersion).toEqual('1.7');
		expect(textResult.total).toEqual(9);
		expect(textResult.text).toContain('BMCL Digest');
	});
});

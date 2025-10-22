import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('test-load url string', () => {
	test('results be correct', { timeout: 15000 }, async () => {
		const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });
		const infoResult = await parser.getInfo();
		const textResult = await parser.getText();
		expect(infoResult.total).toEqual(9);
		expect(infoResult.infoData?.PDFFormatVersion).toEqual('1.4');
		expect(textResult.total).toEqual(9);
		expect(textResult.text).toContain('Bitcoin');
	});
});

describe('test-load url object', () => {
	test('results be correct', { timeout: 15000 }, async () => {
		const parser = new PDFParse({ url: new URL('https://mehmet-kozan.github.io/pdf-parse/pdf/bitcoin.pdf') });
		const infoResult = await parser.getInfo();
		const textResult = await parser.getText();
		expect(infoResult.total).toEqual(9);
		expect(infoResult.infoData?.PDFFormatVersion).toEqual('1.4');
		expect(textResult.total).toEqual(9);
		expect(textResult.text).toContain('Bitcoin');
	});
});

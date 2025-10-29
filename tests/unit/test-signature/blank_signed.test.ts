import { pdf_file } from '../helper/_helper';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('test-load base64', async () => {
	const buffer = await pdf_file('blank_signed.pdf');
	const parser = new PDFParse({ data: buffer });
	const infoResult = await parser.getInfo({ parsePageInfo: true });
	test('results be correct', () => {
		expect(infoResult.total).toEqual(1);
		expect(infoResult.infoData?.PDFFormatVersion).toEqual('1.5');
		expect(infoResult.infoData?.IsSignaturesPresent).toEqual(true);
	});
});

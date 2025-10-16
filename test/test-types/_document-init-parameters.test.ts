import { type DocumentInitParameters, PDFParse } from '../../src/index';
import { describe, expect, test } from 'vitest';

const URL_STR = 'https://bugzilla.mozilla.org/attachment.cgi?id=733434';

describe('DocumentInitParameters Type Tests', async () => {
	test('should construct PDFParse with a URL DocumentInitParameters and return text', async () => {
		const params: DocumentInitParameters = { url: new URL(URL_STR) };

		const parser = new PDFParse(params);

		const textResult = await parser.getText();
		await parser.destroy();

		expect(textResult).toBeDefined();
		expect(typeof textResult.text).toBe('string');
		expect(textResult.text.length).toBeGreaterThan(0);
		expect(Array.isArray(textResult.pages)).toBe(true);
		expect(textResult.total).toBeGreaterThan(0);
	});
});

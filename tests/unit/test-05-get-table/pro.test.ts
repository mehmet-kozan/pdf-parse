import { PDFParse } from 'pdf-parse/pro';
import { describe, expect, test } from 'vitest';

describe('is pro test', async () => {
	const parser = new PDFParse({});

	test('is pro', () => {
		expect(parser.isPro()).toBe(true);
	});
});

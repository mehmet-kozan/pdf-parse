import { VerbosityLevel } from 'pdf-parse';
import { VerbosityLevel as RawVerbosityLevel } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { describe, expect, test } from 'vitest';

describe('test common types', async () => {
	test('verbosity-level', () => {
		expect(VerbosityLevel.ERRORS).toEqual(RawVerbosityLevel.ERRORS);
		expect(VerbosityLevel.INFOS).toEqual(RawVerbosityLevel.INFOS);
		expect(VerbosityLevel.WARNINGS).toEqual(RawVerbosityLevel.WARNINGS);
	});
});

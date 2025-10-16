const { PDFParse } = require('pdf-parse');
const { describe, it } = require('node:test');
const assert = require('node:assert');
const { join } = require('node:path');
const { CustomCanvasFactory } = require('pdf-parse/canvas');
const { readFileSync } = require('node:fs');

const __pdf = join(__dirname, '../test/pdf_file/image-test.pdf');

describe('commonjs module test', () => {
	it('results must be valid', async () => {
		const buffer = readFileSync(__pdf);
		const parser = new PDFParse({ data: buffer, CanvasFactory: CustomCanvasFactory });
		const textResult = await parser.getText();
		const screenshotResult = await parser.getScreenshot();
		const imageResult = await parser.getImage();
		await parser.destroy();

		assert.ok(textResult.text.includes('Text-01'), 'text');
		assert.ok(screenshotResult.pages[0].dataUrl.length > 100, 'screenshot');
		assert.ok(imageResult.pages[0].images[0].dataUrl.length > 100, 'image');
	});
});

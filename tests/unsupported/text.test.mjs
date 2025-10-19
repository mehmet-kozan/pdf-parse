import { CanvasFactory } from 'pdf-parse/worker';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __pdf = join(__dirname, '../../reports/pdf/image-test.pdf');

describe('es module test', () => {
	it('results must be valid', async () => {
		const buffer = readFileSync(__pdf);
		const parser = new PDFParse({ data: buffer, CanvasFactory });
		const textResult = await parser.getText();
		const screenshotResult = await parser.getScreenshot();
		const imageResult = await parser.getImage();
		await parser.destroy();

		assert.ok(textResult.text.includes('Text-01'), 'text');
		assert.ok(screenshotResult.pages[0].dataUrl.length > 100, 'screenshot');
		assert.ok(imageResult.pages[0].images[0].dataUrl.length > 100, 'image');
	});
});

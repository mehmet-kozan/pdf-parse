import { CanvasFactory, getPath } from 'pdf-parse/worker';
import { data } from '../helper/image-test';
import { PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

const path = getPath();
PDFParse.setWorker(path);

describe('worker canvas', () => {
	test('canvas', async () => {
		const buffer = await data.getBuffer();
		const parser = new PDFParse({ data: buffer, CanvasFactory });

		const textResult = await parser.getText();
		const screenshotResult = await parser.getScreenshot();
		const imageResult = await parser.getImage();

		expect(textResult.text).includes('Text-01');
		expect(screenshotResult.pages[0].dataUrl).toBeTruthy();
		expect(imageResult.pages[0].images[0].dataUrl).toBeTruthy();
	});
});

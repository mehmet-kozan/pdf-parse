import { describe, expect, test } from 'vitest';
import { isCanvasLoaded, PDFParse } from 'pdf-parse';
import { data as defaultTestData } from '../helper/default-test';
import { data as imageTestData } from '../helper/image-test';

describe('LazyCanvasFactory', async () => {
	const textBuffer = await defaultTestData.getBuffer();
	const imageBuffer = await imageTestData.getBuffer();

	test('getImage should work with LazyCanvasFactory', async () => {
		const parser = new PDFParse({ data: imageBuffer });
		const result = await parser.getImage({ imageBuffer: true, first: 1 });

		// Should have processed the page with images
		expect(result.pages.length).toBeGreaterThan(0);
		expect(result.pages[0].images.length).toBeGreaterThan(0);
		// After getImage with actual images, canvas should be loaded
		expect(isCanvasLoaded()).toBe(true);
		await parser.destroy();
	});

	test('getScreenshot should work with LazyCanvasFactory', async () => {
		const parser = new PDFParse({ data: textBuffer });
		const result = await parser.getScreenshot({ imageBuffer: true, first: 1 });

		// Should have processed the page
		expect(result.pages.length).toBeGreaterThan(0);
		// After getScreenshot, canvas should be loaded
		expect(isCanvasLoaded()).toBe(true);
		await parser.destroy();
	});

	test('destroy should call clearCanvasCache without error', async () => {
		const parser = new PDFParse({ data: textBuffer });
		await parser.getText({ first: 1 });

		// Should not throw
		await expect(parser.destroy()).resolves.not.toThrow();
	});

	test('destroy after getImage should cleanup canvas without error', async () => {
		const parser = new PDFParse({ data: imageBuffer });
		await parser.getImage({ imageBuffer: true, first: 1 });

		// Should cleanup without error
		await expect(parser.destroy()).resolves.not.toThrow();
	});
});

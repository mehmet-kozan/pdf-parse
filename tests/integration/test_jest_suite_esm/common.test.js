import { PDFParse } from 'pdf-parse';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __pdf = join(__dirname, '../../../reports/pdf/');

test('jest framework test - dummy-test.pdf', async () => {
	const data = readFileSync(join(__pdf, 'dummy.pdf'));
	const parser = new PDFParse({ data });
	const result = await parser.getText();
	await parser.destroy();
	expect(result.text).toContain('Dummy PDF file');
});

test('jest framework test - image-test.pdf - ss', async () => {
	const data = readFileSync(join(__pdf, 'image-test.pdf'));

	const parser = new PDFParse({ data });
	const result = await parser.getScreenshot();
	await parser.destroy();
	expect(result.pages[0].dataUrl.length).toBeGreaterThan(0);
});

test('jest framework test - image-test.pdf - embed', async () => {
	const data = readFileSync(join(__pdf, 'image-test.pdf'));

	const parser = new PDFParse({ data });
	const result = await parser.getImage();
	await parser.destroy();
	expect(result.pages[0].images[0].dataUrl.length).toBeGreaterThan(0);
});

test('jest framework test - full-test.pdf', async () => {
	const data = readFileSync(join(__pdf, 'default-test.pdf'));

	const parser = new PDFParse({ data });
	const result = await parser.getText({ last: 1 });
	await parser.destroy();
	expect(result.text).toContain('be interpreted as necessarily');
});

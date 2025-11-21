const { PDFParse } = require('pdf-parse');
const fs = require('node:fs');
const path = require('node:path');

const __pdf = path.join(__dirname, '../../../reports/pdf/');

test('jest framework test - dummy-test.pdf', async () => {
	const data = fs.readFileSync(path.join(__pdf, 'dummy.pdf'));
	const parser = new PDFParse({ data });
	const result = await parser.getText();
	await parser.destroy();
	expect(result.text).toContain('Dummy PDF file');
});

test('jest framework test - image-test.pdf - ss', async () => {
	const data = fs.readFileSync(path.join(__pdf, 'image-test.pdf'));

	const parser = new PDFParse({ data });
	const result = await parser.getScreenshot();
	await parser.destroy();
	expect(result.pages[0].dataUrl.length).toBeGreaterThan(0);
});

test('jest framework test - image-test.pdf - embed', async () => {
	const data = fs.readFileSync(path.join(__pdf, 'image-test.pdf'));

	const parser = new PDFParse({ data });
	const result = await parser.getImage();
	await parser.destroy();
	expect(result.pages[0].images[0].dataUrl.length).toBeGreaterThan(0);
});

test('jest framework test - full-test.pdf', async () => {
	const data = fs.readFileSync(path.join(__pdf, 'default-test.pdf'));

	const parser = new PDFParse({ data });
	const result = await parser.getText({ last: 1 });
	await parser.destroy();
	expect(result.text).toContain('be interpreted as necessarily');
});

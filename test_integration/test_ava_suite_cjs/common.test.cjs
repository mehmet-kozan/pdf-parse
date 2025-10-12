const test = require('ava');
const { PDFParse } = require('pdf-parse');
const pdf = require('pdf-parse/node');
const fs = require('node:fs');
const path = require('node:path');

const __pdf_files = path.join(__dirname, '../../test/pdf_files');

test('ava framework test - dummy-test.pdf', async (t) => {
	const data = fs.readFileSync(path.join(__pdf_files, 'dummy-test.pdf'));
	const parser = new PDFParse({ data });
	const result = await parser.getText();
	await parser.destroy();
	t.true(result.text.includes('Dummy PDF file'));
});

test('ava framework test - image-test.pdf - ss', async (t) => {
	const data = fs.readFileSync(path.join(__pdf_files, 'image-test.pdf'));

	const parser = new PDFParse({ data });
	const result = await parser.getScreenshot();
	await parser.destroy();
	t.true(result.pages[0].dataUrl.length > 0);
});

test('ava framework test - image-test.pdf - embed', async (t) => {
	const data = fs.readFileSync(path.join(__pdf_files, 'image-test.pdf'));

	const parser = new PDFParse({ data });
	const result = await parser.getImage();
	await parser.destroy();
	t.true(result.pages[0].images[0].dataUrl.length > 0);
});

test('ava framework test - full-test.pdf', async (t) => {
	const data = fs.readFileSync(path.join(__pdf_files, 'full-test.pdf'));

	const parser = new PDFParse({ data });
	const result = await parser.getText({ last: 1 });
	await parser.destroy();
	t.true(result.text.includes('be interpreted as necessarily'));
});

// /node test

test('ava framework test - node - dummy-test.pdf', async (t) => {
	const data = fs.readFileSync(path.join(__pdf_files, 'dummy-test.pdf'));

	const parser = new pdf.PDFParse({ data });
	const result = await parser.getText();
	await parser.destroy();
	t.true(result.text.includes('Dummy PDF file'));
});

test('ava framework test - node - image-test.pdf - ss', async (t) => {
	const data = fs.readFileSync(path.join(__pdf_files, 'image-test.pdf'));

	const parser = new pdf.PDFParse({ data });
	const result = await parser.getScreenshot();
	await parser.destroy();
	t.true(result.pages[0].dataUrl.length > 0);
});

test('ava framework test - node - image-test.pdf - embed', async (t) => {
	const data = fs.readFileSync(path.join(__pdf_files, 'image-test.pdf'));

	const parser = new pdf.PDFParse({ data });
	const result = await parser.getImage();
	await parser.destroy();
	t.true(result.pages[0].images[0].dataUrl.length > 0);
});

test('ava framework test - node - full-test.pdf', async (t) => {
	const data = fs.readFileSync(path.join(__pdf_files, 'full-test.pdf'));

	const parser = new pdf.PDFParse({ data });
	const result = await parser.getText({ last: 1 });
	await parser.destroy();
	t.true(result.text.includes('be interpreted as necessarily'));
});

const test = require('ava');
const { PDFParse } = require('../../dist/cjs/index.cjs');
const fs = require('node:fs');
const path = require('node:path');

test('ava test framework test', async (t) => {
	const data = fs.readFileSync(path.join(__dirname, 'test.pdf'));

	const parser = new PDFParse({ data });
	const result = await parser.getText(data);
	await parser.destroy();
	t.true(result.text.length > 100);
});

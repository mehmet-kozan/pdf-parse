const test = require('ava');
const pdf_local = require('../dist/cjs/index.cjs');
const fs = require('node:fs');
const path = require('node:path');

test('my passing test', async (t) => {
	const data = fs.readFileSync(path.join(__dirname, 'test.pdf'));
	const result = await pdf_local(data);
	// const result = await pdf_local(data).catch((err) => {
	// 	// biome-ignore lint/suspicious/noConsole: <debug purpose>
	// 	console.error(err.message);
	// });
	//console.log(result);
	t.true(result.text.length > 100);
});

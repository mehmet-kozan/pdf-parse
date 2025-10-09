/** biome-ignore-all lint/suspicious/noConsole: <example code> */
const fs = require('node:fs');
const path = require('node:path');
const { PDFParse } = require('../dist/cjs/index.cjs');

const file = path.join(__dirname, 'test.pdf');
const buffer = fs.readFileSync(file);

const parser = new PDFParse({ data: buffer });
parser
	.getText()
	.then((result) => {
		console.log(result.text);
	})
	.finally(async () => {
		await parser.destroy();
	});

/** biome-ignore-all lint/suspicious/noConsole: <example code> */
const fs = require('node:fs');
const path = require('node:path');
const { PDFParse } = require('../dist/cjs/index.cjs');

const file = path.join(__dirname, 'image-test.pdf');
const buffer = fs.readFileSync(file);

async function run() {
	const parser = new PDFParse({ data: buffer });
	const result = await parser.getScreenshot();
	console.log(result.pages[0].dataUrl);
}

run();

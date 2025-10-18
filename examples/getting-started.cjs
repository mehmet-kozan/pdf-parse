// v1
// const pdf = require('pdf-parse');
// pdf(buffer).then(result => console.log(result.text));

// v2
const { PDFParse } = require('pdf-parse');
//import { PDFParse } from 'pdf-parse';

async function run() {
	const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });

	const result = await parser.getText();
	console.log(result.text);
}

run();

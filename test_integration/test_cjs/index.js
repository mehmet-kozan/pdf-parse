const { PDFParse } = require('pdf-parse');

async function test() {
	const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });
	const result = await parser.getText();
	if (result.text.includes('Bitcoin')) {
		process.exit(0);
	} else {
		process.exit(1);
	}
}

test();

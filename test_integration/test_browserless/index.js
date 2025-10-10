/** biome-ignore-all lint/suspicious/noConsole: <test file> */
const { default: listen } = require('async-listen');
const { createServer } = require('node:http');
const os = require('node:os');
const createBrowser = require('browserless');
const {PDFParse} = require('pdf-parse');

async function runServer(handler) {
	const server = createServer(async (req, res) => {
		await handler({ req, res });
	});

	const url = await listen(server);
	url.hostname = os.hostname();
	const urlStr = url.toString();
	return { server, url: urlStr };
}

const getUrl = runServer(({ res }) => {
	res.setHeader('Content-Type', 'text/html');
	return res.end(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <p>hello world</p>
    </body>
    </html>`);
});

async function run() {
	try {
		const browser = createBrowser();
		const browserless = await browser.createContext();
		const { server, url } = await getUrl;
		const buffer = await browserless.pdf(url);
		server.close();

		const parser = new PDFParse({ data: buffer });
		const data = await parser.getText();

		await parser.destroy();

		if (data.text.includes('hello world')) {
			process.exit(0);
		}
		process.exit(1);
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}

run();

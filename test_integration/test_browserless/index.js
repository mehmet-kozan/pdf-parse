/** biome-ignore-all lint/suspicious/noConsole: <test file> */
const { default: listen } = require('async-listen');
const { createServer } = require('node:http');
const os = require('node:os');
const createBrowser = require('browserless');
const remote = require('pdf-parse');
const local = require('../../dist/cjs/index.cjs');

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

		const remote_buffer = new Uint8Array(buffer);
		const local_buffer = new Uint8Array(buffer);

		const remote_parser = new remote.PDFParse({ data: remote_buffer });
		const local_parser = new local.PDFParse({ data: local_buffer });

		const remote_data = await remote_parser.getText();
		const local_data = await local_parser.getText();

		await remote_parser.destroy();
		await local_parser.destroy();

		if (remote_data.text.includes('hello world') && local_data.text.includes('hello world')) {
			process.exit(0);
		}
		process.exit(1);
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}

run();

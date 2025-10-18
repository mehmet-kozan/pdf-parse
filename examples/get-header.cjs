const { getHeader } = require('pdf-parse/utils');

async function run() {
	// HEAD request to retrieve HTTP headers and file size without downloading the full file.
	// Pass `true` to check PDF magic bytes via range request
	// Optionally validates PDFs by fetching the first 4 bytes (magic bytes).
	// Useful for checking file existence, size, and type before full parsing.
	// Node only, will not work in browser environments.
	const result = await getHeader('https://bitcoin.org/bitcoin.pdf', true);

	console.log(`Status: ${result.status}`);
	console.log(`Content-Length: ${result.size}`);
	console.log(`Is PDF: ${result.isPdf}`);
	console.log(`Headers:`, result.headers);
}
run();

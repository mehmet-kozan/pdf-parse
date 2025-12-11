// Important: getHeader is available from the 'pdf-parse/node' submodule
import { PDFParse } from 'pdf-parse';

// HEAD request to retrieve HTTP headers and file size without downloading the full file.
// Pass `true` to check PDF magic bytes via range request
// Optionally validates PDFs by fetching the first 4 bytes (magic bytes).
// Useful for checking file existence, size, and type before full parsing.
// Node only, will not work in browser environments.
const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });
const result = await parser.getHeader(true);
console.log(`Overall Result: ${result.ok}`);
console.log(`File Size: ${result.fileSize}`);
console.log(`Valid PDF: ${result.validPdf}`);

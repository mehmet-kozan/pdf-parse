import { readFile, writeFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

const link = 'https://bitcoin.org/bitcoin.pdf';
// const buffer = await readFile('reports/pdf/bitcoin.pdf');
// const parser = new PDFParse({ data: buffer });

const parser = new PDFParse({ url: link });

// scale:1 for original page size.
// scale:1.5 %50 bigger.
const result = await parser.getScreenshot({ scale: 1.5 });

await parser.destroy();
await writeFile('bitcoin.png', result.pages[0].data);

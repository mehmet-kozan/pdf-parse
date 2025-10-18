import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

const link = 'https://mehmet-kozan.github.io/pdf-parse/pdf/climate.pdf';
// const buffer = await readFile('reports/pdf/climate.pdf');
// const parser = new PDFParse({ data: buffer });

const parser = new PDFParse({ url: link });
const result = await parser.getInfo({ parsePageInfo: true });
await parser.destroy();

console.log(`Total pages: ${result.total}`);
console.log(`Title: ${result.info?.Title}`);
console.log(`Author: ${result.info?.Author}`);
console.log(`Creator: ${result.info?.Creator}`);
console.log(`Producer: ${result.info?.Producer}`);

// Access parsed date information
const dates = result.getDateNode();
console.log(`Creation Date: ${dates.CreationDate}`);
console.log(`Modification Date: ${dates.ModDate}`);

// Links, pageLabel, width, height (when `parsePageInfo` is true)
console.log('Per-page information:');
console.log(JSON.stringify(result.pages, null, 2));

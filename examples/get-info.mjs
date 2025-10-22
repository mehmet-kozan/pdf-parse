import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

const link = 'https://mehmet-kozan.github.io/pdf-parse/pdf/climate.pdf';
// const buffer = await readFile('reports/pdf/climate.pdf');
// const parser = new PDFParse({ data: buffer });

const parser = new PDFParse({ url: link });
const result = await parser.getInfo({ parsePageInfo: true });
await parser.destroy();

console.log(`Total pages: ${result.total}`);
console.log(`Title: ${result.infoData?.Title}`);
console.log(`Author: ${result.infoData?.Author}`);
console.log(`Creator: ${result.infoData?.Creator}`);
console.log(`Producer: ${result.infoData?.Producer}`);
console.log(`Creation Date: ${result.infoData?.CreationDate}`);
console.log(`Modification Date: ${result.infoData?.ModDate}`);

// Links, pageLabel, width, height (when `parsePageInfo` is true)
console.log('Per-Page information:');
console.log(JSON.stringify(result.pages, null, 2));

console.log('full information:');
console.log(JSON.stringify(result.toJSON(), null, 2));

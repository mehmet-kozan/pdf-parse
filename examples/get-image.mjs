import { readFile, writeFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

const link = new URL('https://mehmet-kozan.github.io/pdf-parse/pdf/image-test.pdf');
// const buffer = await readFile('reports/pdf/image-test.pdf');
// const parser = new PDFParse({ data: buffer });

const parser = new PDFParse({ url: link });
const result = await parser.getImage();
await parser.destroy();

await writeFile('adobe.png', result.pages[0].images[0].data);

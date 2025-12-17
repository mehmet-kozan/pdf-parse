import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse/pro';

const link = new URL('https://mehmet-kozan.github.io/pdf-parse/pdf/simple-table.pdf');
// const buffer = await readFile('reports/pdf/simple-table.pdf');
// const parser = new PDFParse({ data: buffer });

const parser = new PDFParse({ url: link });
const result = await parser.getTable();
await parser.destroy();

// Pretty-print each row of the first table
for (const row of result.pages[0].tables[0]) {
	console.log(JSON.stringify(row));
}

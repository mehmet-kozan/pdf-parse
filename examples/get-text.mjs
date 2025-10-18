import { PDFParse } from 'pdf-parse';

const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });
const result = await parser.getText();
// to extract text from page 3 only:
// const result = await parser.getText({ partial: [3] });
await parser.destroy();
console.log(result.text);

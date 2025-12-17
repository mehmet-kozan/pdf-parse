import { PDFParse } from 'pdf-parse';

// 242 mb
const link =
	'https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_Full_Report.pdf?spm=a2ty_o01.29997173.0.0.bd03c921juVCxB&file=IPCC_AR6_WGI_Full_Report.pdf';

const parser = new PDFParse({ url: link, disableAutoFetch: true, disableStream: true, rangeChunkSize: 65536 });
const result = await parser.getText({ first: 3 });
// to extract text from page 3 only:
// const result = await parser.getText({ partial: [3] });
await parser.destroy();
console.log(parser.progress.total);
console.log(parser.progress.loaded);

<p align="right"><a href="https://www.npmjs.com/package/pdf-parse"><img src="https://nodei.co/npm/pdf-parse.svg?data=d"></a></p>

# pdf-parse

<div align="center">

**A pure TypeScript/JavaScript, cross-platform module for extracting text, images, and tabular data from PDF files.**

[![npm downloads](https://img.shields.io/npm/dm/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![npm version](https://img.shields.io/npm/v/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![node version](https://img.shields.io/node/v/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![tests](https://github.com/mehmet-kozan/pdf-parse/actions/workflows/test.yml/badge.svg)](https://github.com/mehmet-kozan/pdf-parse/actions/workflows/test.yml)
[![biome](https://img.shields.io/badge/code_style-biome-60a5fa?logo=biome)](https://biomejs.dev)
[![vitest](https://img.shields.io/badge/tested_with-vitest-6E9F18?logo=vitest)](https://vitest.dev)
[![codecov](https://codecov.io/github/mehmet-kozan/pdf-parse/graph/badge.svg?token=FZL3G8KNZ8)](https://codecov.io/github/mehmet-kozan/pdf-parse)
[![socket badge](https://socket.dev/api/badge/npm/package/pdf-parse)](https://socket.dev/npm/package/pdf-parse)
[![test & coverage reports](https://img.shields.io/badge/reports-view-brightgreen.svg)](https://mehmet-kozan.github.io/pdf-parse/)

</div>
<br />

> **Contributing Note:** When opening an issue, please attach the relevant PDF file if possible. Providing the file will help us reproduce and resolve your issue more efficiently. For detailed guidelines on how to contribute, report bugs, or submit pull requests, see: [`contributing to pdf-parse`](https://github.com/mehmet-kozan/pdf-parse?tab=contributing-ov-file#contributing-to-pdf-parse)

## Features
- Supports Node.js and browsers 
- CommonJS and ESM support 
- Vulnerability and security info : [`security policy`](https://github.com/mehmet-kozan/pdf-parse?tab=security-ov-file#security-policy)
- Extract page text : `getText` 
- Extract embedded images : `getImage` 
- Render pages as images : `pageToImage` 
- Detect and extract tabular data : `getTable` 
- For additional usage examples, check the [`test`](./test) folder and [`live demo`](https://mehmet-kozan.github.io/pdf-parse/)
- Live demo source: [`gh-pages branch`](https://github.com/mehmet-kozan/pdf-parse/tree/gh-pages)

## Similar Packages
* [pdf2json](https://www.npmjs.com/package/pdf2json) — Buggy, memory leaks, uncatchable errors in some PDF files.
* [pdfdataextract](https://www.npmjs.com/package/pdfdataextract) — `pdf-parse` based
* [unpdf](https://www.npmjs.com/package/unpdf) — `pdf-parse` based
* [pdf-extract](https://www.npmjs.com/package/pdf-extract) — Not cross-platform, depends on xpdf
* [j-pdfjson](https://www.npmjs.com/package/j-pdfjson) — Fork of pdf2json
* [pdfreader](https://www.npmjs.com/package/pdfreader) — Uses pdf2json
* [pdf-extract](https://www.npmjs.com/package/pdf-extract) — Not cross-platform, depends on xpdf

> **Benchmark Note:** The benchmark currently runs only against `pdf2json`. I don't know the current state of `pdf2json` — the original reason for creating `pdf-parse` was to work around stability issues with `pdf2json`. I deliberately did not include `pdf-parse` or other `pdf.js`-based packages in the benchmark because dependencies conflict. If you have recommendations for additional packages to include, please open an issue.[`benchmark results`](https://mehmet-kozan.github.io/pdf-parse/bench.html)


## Installation
```sh
npm install pdf-parse
# or
pnpm add pdf-parse
# or
yarn add pdf-parse
# or
bun add pdf-parse
```

## Basic Usage

- High-level helper for v1 compatibility: [`pdf`](src/index.cjs.ts)
- Full API: [`PDFParse`](src/PDFParse.ts)

### CommonJS Example, helper for v1 compatibility
```js
const pdf  = require('pdf-parse');
// or 
// const {pdf,PDFParse}  = require('pdf-parse');
const fs = require('fs');

const data = fs.readFileSync('test.pdf');

pdf(data).then(result=>{
    console.log(result.text);
});
```

### getText — Extract Text
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile } from 'node:fs/promises';

const buffer = await readFile('test/test-01/test.pdf');

const parser = new PDFParse({ data: buffer });
const textResult = await parser.getText();
console.log(textResult.text);
```
For a complete list of configuration options, see:
- [`DocumentInitParameters`](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html#~DocumentInitParameters) - PDF.js document initialization options
- [`ParseParameters`](src/ParseParameters.ts) - pdf-parse specific options

Usage Examples
- Parse password protected PDF:  [`test/test-06-password`](test/test-06-password/pdf-password.test.ts)
- Parse only specific pages: [`test/test-parse-parameters`](test/test-parse-parameters/pdf-parse-parameters.test.ts)
- Parse embedded hyperlinks: [`test/test-hyperlinks`](test/test-hyperlinks/pdf-hyperlink.test.ts)
- Load PDF from URL: [`test/test-types`](test/test-types/text-result-type.test.ts)

### pageToImage — Render Page to PNG
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile, writeFile } from 'node:fs/promises';

const buffer = await readFile('test/test-01/test.pdf');

const parser = new PDFParse({ data: buffer });
const result = await parser.pageToImage();

for (const pageData of result.pages) {
    const imgFileName = `page_${pageData.pageNumber}.png`;
    await writeFile(imgFileName, pageData.data, { flag: 'w' });
}
```

### getImage — Extract Embedded Images
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile, writeFile } from 'node:fs/promises';

const buffer = await readFile('test/test-01/test.pdf');

const parser = new PDFParse({ data: buffer });
const result = await parser.getImage();

for (const pageData of result.pages) {
    for (const pageImage of pageData.images) {
        const imgFileName = `page_${pageData.pageNumber}-${pageImage.fileName}.png`;
        await writeFile(imgFileName, pageImage.data, { flag: 'w' });
    }
}
```

### getTable — Extract Tabular Data
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile } from 'node:fs/promises';

const buffer = await readFile('test/test-01/test.pdf');

const parser = new PDFParse({ data: buffer });
const result = await parser.getTable();

for (const pageData of result.pages) {
    for (const table of pageData.tables) {
        console.log(table);
    }
}
```

## Web / Browser
- After running `npm run build`, you will find both regular and minified browser bundles in `dist/browser` (e.g., `pdf-parse.es.js` and `pdf-parse.es.min.js`).
- Check: [`live demo`](https://mehmet-kozan.github.io/pdf-parse/)
- Live demo source: [`gh-pages branch`](https://github.com/mehmet-kozan/pdf-parse/tree/gh-pages)

Use the minified versions (`.min.js`) for production to reduce file size, or the regular versions for development and debugging.

> You can use any of the following browser bundles depending on your module system and requirements:  
> - `pdf-parse.es.js` or `pdf-parse.es.min.js` for ES modules  
> - `pdf-parse.umd.js` or `pdf-parse.umd.min.js` for UMD/global usage  

You can include the browser bundle directly from a CDN. Use the latest version:

- [https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf-parse.es.min.js](https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf-parse.es.min.js)
- [https://unpkg.com/pdf-parse@latest/dist/browser/pdf-parse.es.min.js](https://unpkg.com/pdf-parse@latest/dist/browser/pdf-parse.es.min.js)

Or specify a particular version:

- [https://cdn.jsdelivr.net/npm/pdf-parse@2.1.10/dist/browser/pdf-parse.es.min.js](https://cdn.jsdelivr.net/npm/pdf-parse@2.1.10/dist/browser/pdf-parse.es.min.js)
- [https://unpkg.com/pdf-parse@2.1.10/dist/browser/pdf-parse.es.min.js](https://unpkg.com/pdf-parse@2.1.10/dist/browser/pdf-parse.es.min.js)


> **Worker Note:** In browser environments, the package sets `pdfjs.GlobalWorkerOptions.workerSrc` automatically when imported from the built browser bundle. If you use a custom build or host `pdf.worker` yourself, configure pdfjs accordingly.






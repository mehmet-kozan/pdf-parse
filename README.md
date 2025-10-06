<p align="right"><a href="https://www.npmjs.com/package/pdf-parse"><img src="https://nodei.co/npm/pdf-parse.svg?data=d"></a></p>

# pdf-parse

**A pure TypeScript/JavaScript, cross-platform module for extracting text, images, and tabular data from PDF files.**

<div align="center">

[![npm downloads](https://img.shields.io/npm/dm/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![npm version](https://img.shields.io/npm/v/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![node version](https://img.shields.io/node/v/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![tests](https://github.com/mehmet-kozan/pdf-parse/actions/workflows/test.yml/badge.svg)](https://github.com/mehmet-kozan/pdf-parse/actions/workflows/test.yml)
[![test & coverage reports](https://img.shields.io/badge/test_reports-view-brightgreen.svg)](https://mehmet-kozan.github.io/pdf-parse/)
[![biome](https://img.shields.io/badge/code_style-biome-60a5fa?logo=biome)](https://biomejs.dev)
[![vitest](https://img.shields.io/badge/tested_with-vitest-6E9F18?logo=vitest)](https://vitest.dev)
[![codecov](https://codecov.io/github/mehmet-kozan/pdf-parse/graph/badge.svg?token=FZL3G8KNZ8)](https://codecov.io/github/mehmet-kozan/pdf-parse)

</div>
<br />

> **Contributing Note:** When opening an issue, please attach the relevant PDF file if possible. Providing the file will help us reproduce and resolve your issue more efficiently.

## Features
- Supports Node.js and browsers 
- CommonJS and ESM support 
- Extract page text: `getText` 
- Extract embedded images: `getImage` 
- Render pages as images: `pageToImage` 
- Detect and extract tabular data: `getTable` 
- For additional usage examples, check the [`example`](./example) and [`test`](./test) folders. 

## Similar Packages
* [pdf2json](https://www.npmjs.com/package/pdf2json) — Buggy, memory leaks, uncatchable errors in some PDF files.
* [j-pdfjson](https://www.npmjs.com/package/j-pdfjson) — Fork of pdf2json
* [pdfreader](https://www.npmjs.com/package/pdfreader) — Uses pdf2json
* [pdf-extract](https://www.npmjs.com/package/pdf-extract) — Not cross-platform, depends on xpdf

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
- Parse only specific pages: [`test/test-parse-parameters`](test/test-parse-parameters/pdf-parse-paremeters.test.ts)
- Parse embedded hyperlinks: [`test/test-hyperlinks`](test/test-hyperlinks/pdf-hyperlink.test.ts)
- Load PDF from URL: [`test/test-types`](test/test-types/textresult-type.test.ts)

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

### Example — Web / Browser
- After running `npm run build`, you will find both regular and minified browser bundles in `dist/browser` (e.g., `pdf-parse.es.js` and `pdf-parse.es.min.js`).
- See a minimal browser example in [example/browser/pdf-parse.es.html](example/browser/pdf-parse.es.html).

You can use the minified versions (`.min.js`) for production to reduce file size, or the regular versions for development and debugging.

Inline browser usage example:

> You can use any of the following browser bundles depending on your module system and requirements:  
> - `pdf-parse.es.js` or `pdf-parse.es.min.js` for ES modules  
> - `pdf-parse.umd.js` or `pdf-parse.umd.min.js` for UMD/global usage  

You can include the browser bundle directly from a CDN. Use the latest version:

- [https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf-parse.es.min.js](https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf-parse.es.min.js)
- [https://unpkg.com/pdf-parse@latest/dist/browser/pdf-parse.es.min.js](https://unpkg.com/pdf-parse@latest/dist/browser/pdf-parse.es.min.js)

Or specify a particular version:

- [https://cdn.jsdelivr.net/npm/pdf-parse@2.1.7/dist/browser/pdf-parse.es.min.js](https://cdn.jsdelivr.net/npm/pdf-parse@2.1.7/dist/browser/pdf-parse.es.min.js)
- [https://unpkg.com/pdf-parse@2.1.7/dist/browser/pdf-parse.es.min.js](https://unpkg.com/pdf-parse@2.1.7/dist/browser/pdf-parse.es.min.js)



```html
<!-- Import the ES browser bundle built to dist/browser/pdf-parse.es.js -->
<script type="module">
import { pdf } from './dist/browser/pdf-parse.es.js';

const input = document.querySelector('#file');
const btn = document.querySelector('#parse');
const out = document.querySelector('#output');

btn.addEventListener('click', async () => {
  const f = input.files?.[0];
  if (!f) {
    out.textContent = 'Please select a PDF file.';
    return;
  }
  const ab = await f.arrayBuffer();
  const result = await pdf(new Uint8Array(ab));
  out.textContent = result.text?.slice(0, 10000) ?? 'No text found.';
});
</script>
```

### Options

Most options are forwarded to pdfjs (`getDocument`). Common `ParseOptions` supported by the public API:

- `data`: ArrayBuffer | Uint8Array | TypedArray | number[]  
  The binary PDF data. Prefer `Uint8Array` to reduce main-thread memory usage (typed arrays can be transferred to the worker).
- `url`: string | URL  
  Remote PDF URL. The helper `pdf()` accepts a URL instance.
- `partial`: boolean (default: false)  
  Enable partial parsing of pages. When true, use `first` and/or `last`.
- `first`: number  
  If `partial` is true, parse the first N pages.
- `last`: number  
  If `partial` is true, parse the last N pages.
- `verbosity`: pdfjs.VerbosityLevel  
  Controls pdf.js logging. The library sets a default (ERRORS), but you can override it.
- `cMapUrl`, `cMapPacked`, `standardFontDataUrl` (browser)  
  Paths to cmap and standard font data when running in the browser build.

Note: Any other options accepted by pdfjs `getDocument()` may also be provided and will be forwarded.

#### Examples

Node / ESM (text extraction, partial parsing)
```js
import fs from 'fs/promises';
import { PDFParse, pdf } from 'pdf-parse';

// Using the helper
const result = await pdf(new Uint8Array(await fs.readFile('test/test-01/test.pdf')));
console.log(result.text);

// Full API with options
const data = new Uint8Array(await fs.readFile('test/test-01/test.pdf'));
const parser = new PDFParse({ data, partial: true, first: 2 }); // Only the first 2 pages
const textRes = await parser.getText();
console.log(textRes.pages.length);
```

Browser (file input, custom cmaps)
```html
<input id="file" type="file" accept="application/pdf">
<button id="parse">Parse</button>
<pre id="out"></pre>

<script type="module">
import { pdf, PDFParse } from './dist/browser/pdf-parse.es.js';

document.querySelector('#parse').addEventListener('click', async () => {
  const f = document.querySelector('#file').files[0];
  if (!f) return;
  const ab = await f.arrayBuffer();
  // Using the helper
  const res = await pdf(new Uint8Array(ab));
  document.querySelector('#out').textContent = res.text.slice(0, 200);

  // Or full API with browser-specific options
  const parser = new PDFParse({
    data: new Uint8Array(ab),
    cMapUrl: '/cmaps/',
    cMapPacked: true
  });
  const pages = await parser.pageToImage();
  console.log(pages);
});
</script>
```

> **Worker Note:** In browser environments, the package sets `pdfjs.GlobalWorkerOptions.workerSrc` automatically when imported from the built browser bundle. If you use a custom build or host `pdf.worker` yourself, configure pdfjs accordingly.






<p align="right"><a href="https://www.npmjs.com/package/pdf-parse"><img src="https://nodei.co/npm/pdf-parse.svg?data=d"></a></p>

# pdf-parse

**A pure JavaScript, cross-platform module to extract text, images, and tables from PDF files.**


[![npm downloads](https://img.shields.io/npm/dt/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![npm version](https://img.shields.io/npm/v/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![node version](https://img.shields.io/node/v/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![License](https://img.shields.io/npm/l/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 

## Similar packages
* [pdf2json](https://www.npmjs.com/package/pdf2json) — buggy, no longer supported, memory leaks, and throws uncaught fatal errors
* [j-pdfjson](https://www.npmjs.com/package/j-pdfjson) — fork of pdf2json
* [pdf-parser](https://github.com/dunso/pdf-parse) — buggy, no tests
* [pdfreader](https://www.npmjs.com/package/pdfreader) — uses pdf2json
* [pdf-extract](https://www.npmjs.com/package/pdf-extract) — not cross-platform (depends on xpdf)


## Installation
```sh
npm install pdf-parse
```

## Basic Usage

API
- High-level helper for compatibility v1: [`pdf`](src/index.ts)
- Full API: [`PDFParse`](src/PDFParse.ts)

### GetText — text extraction
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile } from 'node:fs/promises';


const data = await readFile('test/test-01/test.pdf');
const buffer = new Uint8Array(data);

// Using helper function
const result = await pdf(buffer);

// Using the class
const parser = new PDFParse({ data: buffer });
const textResult = await parser.GetText();
console.log(textResult.text);
```

### PageToImage — render page to PNG
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile, writeFile } from 'node:fs/promises';


const data = await readFile('test/test-01/test.pdf');
const buffer = new Uint8Array(data);

// Using the class
const parser = new PDFParse({ data: buffer });
const result = await parser.PageToImage();

for (const pageData of result.pages) {
    const imgFileName = `page_${pageData.pageNumber}.png`;
    await writeFile(imgFileName, pageData.data, {
        flag: 'w',
    });
}
```

### GetImage — extract embedded images
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile, writeFile } from 'node:fs/promises';


const data = await readFile('test/test-01/test.pdf');
const buffer = new Uint8Array(data);

// Using the class
const parser = new PDFParse({ data: buffer });
const result = await parser.GetImage();

for (const pageData of result.pages) {
    for (const pageImage of pageData.images) {
        const imgFileName = `page_${pageData.pageNumber}-${pageImage.fileName}.png`;
        await writeFile(imgFileName, pageImage.data, {
            flag: 'w',
        });
    }
}
```

### GetTable — extract tabular data
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile, writeFile } from 'node:fs/promises';


const data = await readFile('test/test-01/test.pdf');
const buffer = new Uint8Array(data);

// Using the class
const parser = new PDFParse({ data: buffer });
const result = await parser.GetTable();

for (const pageData of result.pages) {
    for (const table of pageData.tables) {
        console.log(table);
    }
}
```

### Example — Web / Browser
- After running `npm run build`, use the browser bundle in `dist/browser`.
- See a minimal browser example in [example/browser/pdf-parse.es.html](example/browser/pdf-parse.es.html).

Inline browser usage example:
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


## Options

The library forwards most options to pdfjs (getDocument). Common ParseOptions supported by the public API:

- data: ArrayBuffer | Uint8Array | TypedArray | number[]  
  Binary PDF data. Prefer Uint8Array to reduce main-thread memory usage (typed arrays may be transferred to the worker).
- url: string | URL  
  Remote PDF URL. The helper `pdf()` accepts a URL instance.
- partial: boolean (default: false)  
  Enable partial parsing of pages. When true, use `first` and/or `last`.
- first: number  
  If `partial` is true, parse the first N pages.
- last: number  
  If `partial` is true, parse the last N pages.
- verbosity: pdfjs.VerbosityLevel  
  Controls pdf.js logging. The library sets a default (ERRORS) but you can override it.
- cMapUrl, cMapPacked, standardFontDataUrl (browser)  
  Paths to cmap and standard font data when running in the browser build.

Note: Any other options accepted by pdfjs `getDocument()` may also be provided and will be forwarded.

Examples

Node / ESM (text extraction, partial)
```js
import fs from 'fs/promises';
import { PDFParse, pdf } from 'pdf-parse';

// helper
const result = await pdf(new Uint8Array(await fs.readFile('test/test-01/test.pdf')));
console.log(result.text);

// full API with options
const data = new Uint8Array(await fs.readFile('test/test-01/test.pdf'));
const parser = new PDFParse({ data, partial: true, first: 2 }); // only first 2 pages
const textRes = await parser.GetText();
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
  // helper usage
  const res = await pdf(new Uint8Array(ab));
  document.querySelector('#out').textContent = res.text.slice(0, 200);

  // or full API with browser-specific options
  const parser = new PDFParse({
    data: new Uint8Array(ab),
    cMapUrl: '/cmaps/',
    cMapPacked: true
  });
  const pages = await parser.PageToImage();
  console.log(pages);
});
</script>
```

Features
- Extract page text: GetText (via [`pdf`](src/index.ts) or [`PDFParse`](src/PDFParse.ts))
- Extract embedded images: GetImage
- Render page to image: PageToImage
- Detect and extract tabular data: GetTable

Notes
- Uses `pdfjs-dist` for PDF parsing and rendering (see worker setup in [`src/PDFParse.ts`](src/PDFParse.ts)).
- Tests are in [test/](test/) and run with Vitest.

Contributing
1. Fork and branch
2. Make changes and run tests
3. Open a pull request

License
- Apache-2.0 (see LICENSE)

Worker note: In browser environments the package sets pdfjs GlobalWorkerOptions.workerSrc automatically when imported from the built browser bundle. If you use a custom build or host pdf.worker yourself, configure pdfjs accordingly.


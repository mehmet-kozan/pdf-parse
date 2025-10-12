<div align="center"> 

# pdf-parse
**Pure TypeScript, cross-platform module for extracting text, images, and tables from PDFs.**  
**Run 🤗 directly in your browser or in Node!** 

</div> 

<div align="center"> 

[![npm version](https://img.shields.io/npm/v/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![npm downloads](https://img.shields.io/npm/dm/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![node version](https://img.shields.io/node/v/pdf-parse.svg)](https://www.npmjs.com/package/pdf-parse) 
[![tests](https://github.com/mehmet-kozan/pdf-parse/actions/workflows/test.yml/badge.svg)](https://github.com/mehmet-kozan/pdf-parse/actions/workflows/test.yml) 
[![tests](https://github.com/mehmet-kozan/pdf-parse/actions/workflows/test_integration.yml/badge.svg)](https://github.com/mehmet-kozan/pdf-parse/actions/workflows/test_integration.yml) 
[![biome](https://img.shields.io/badge/code_style-biome-60a5fa?logo=biome)](https://biomejs.dev) 
[![vitest](https://img.shields.io/badge/tested_with-vitest-6E9F18?logo=vitest)](https://vitest.dev) 
[![codecov](https://codecov.io/github/mehmet-kozan/pdf-parse/graph/badge.svg?token=FZL3G8KNZ8)](https://codecov.io/github/mehmet-kozan/pdf-parse) 
[![socket badge](https://socket.dev/api/badge/npm/package/pdf-parse)](https://socket.dev/npm/package/pdf-parse) 
[![test & coverage reports](https://img.shields.io/badge/reports-view-brightgreen.svg)](https://mehmet-kozan.github.io/pdf-parse/)  

</div>
<br />

> **Contributing Note:** When opening an issue, please attach the relevant PDF file if possible. Providing the file will help us reproduce and resolve your issue more efficiently. For detailed guidelines on how to contribute, report bugs, or submit pull requests, see: [`contributing to pdf-parse`](https://github.com/mehmet-kozan/pdf-parse?tab=contributing-ov-file#contributing-to-pdf-parse)

## Getting Started with v2 (Coming from v1)
```js
// v1
const pdf = require('pdf-parse');
pdf(buffer).then(result => console.log(result.text));

// v2
const { PDFParse } = require('pdf-parse');
// Or use the bundled build 
// const { PDFParse } = require('pdf-parse/node');
const parser = new PDFParse({ data: buffer });

parser.getText().then((result)=>{
    console.log(result.text)
}).finally(async ()=>{
    await parser.destroy();
});
```  

## Features <a href="https://mehmet-kozan.github.io/pdf-parse/" target="_blank"><img align="right" src="https://img.shields.io/badge/live-demo-brightgreen.svg" alt="demo"></a>  
- CommonJS, ESM, Node.js, and browser support.
- Can be integrated with React, Vue, Angular, or any other web framework.
- Security: [`security policy`](https://github.com/mehmet-kozan/pdf-parse?tab=security-ov-file#security-policy)
- Extract document info : `getInfo` 
- Extract page text : `getText` 
- Render pages as PNG : `getScreenshot` 
- Extract embedded images : `getImage` 
- Detect and extract tabular data : `getTable` 
- Well-covered with [`unit tests`](./test)
- [`Integration tests`](./test_integration) to validate end-to-end behavior across environments.
- See [DocumentInitParameters](./README.options.md#documentinitparameters) and [ParseParameters](./README.options.md#parseparameters) for all available options.
- For usage examples, see  [`example`](./example), [`test`](./test) and [`test/example`](./test/test-example) folders.

## Similar Packages
* [pdf2json](https://www.npmjs.com/package/pdf2json) — Buggy, memory leaks, uncatchable errors in some PDF files.
* [pdfdataextract](https://www.npmjs.com/package/pdfdataextract) — `pdf-parse` based
* [unpdf](https://www.npmjs.com/package/unpdf) — `pdf-parse` based
* [pdf-extract](https://www.npmjs.com/package/pdf-extract) — Non cross-platform, depends on xpdf
* [j-pdfjson](https://www.npmjs.com/package/j-pdfjson) — Fork of pdf2json
* [pdfreader](https://www.npmjs.com/package/pdfreader) — Uses pdf2json
* [pdf-extract](https://www.npmjs.com/package/pdf-extract) — Non cross-platform, depends on xpdf  

> **Benchmark Note:** The benchmark currently runs only against `pdf2json`. I don't know the current state of `pdf2json` — the original reason for creating `pdf-parse` was to work around stability issues with `pdf2json`. I deliberately did not include `pdf-parse` or other `pdf.js`-based packages in the benchmark because dependencies conflict. If you have recommendations for additional packages to include, please open an issue, see [`benchmark results`](https://mehmet-kozan.github.io/pdf-parse/bench.html).

## Supported Node.js Versions

- Supported: Node.js 20 (>= 20.16.0), Node.js 22 (>= 22.3.0), Node.js 23 (>= 23.0.0), and Node.js 24 (>= 24.0.0).
- Not supported: Node.js 21.x, and Node.js 19.x and earlier.

Integration tests run on Node.js 20–24, see [`test_integration.yml`](./.github/workflows/test_integration.yml).

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

## Usage

### `getInfo` — Extract Metadata and Document Information
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile } from 'node:fs/promises';

const buffer = await readFile('test/test-01/test.pdf');

const parser = new PDFParse({ data: buffer });
const info = await parser.getInfo();
await parser.destroy();

console.log(`Total pages: ${info.total}`);
console.log(`Title: ${info.info?.Title}`);
console.log(`Author: ${info.info?.Author}`);
console.log(`Creator: ${info.info?.Creator}`);
console.log(`Producer: ${info.info?.Producer}`);

// Access parsed date information
const dates = info.getDateNode();
console.log(`Creation Date: ${dates.CreationDate}`);
console.log(`Modification Date: ${dates.ModDate}`);

// Links, pageLabel, width, height (when `parseHyperlinks` is enabled)
console.log(`Per-page information: ${info.pages}`);

```

Usage Examples:
- Parse hyperlinks from pages: [`test/test-get-info`](test/test-get-info/get-info.test.ts)
- To extract hyperlinks, pass `{ parseHyperlinks: true }`
- `const info = await parser.getInfo({ parseHyperlinks: true })`

### `getText` — Extract Text
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile } from 'node:fs/promises';

const buffer = await readFile('test/test-01/test.pdf');

const parser = new PDFParse({ data: buffer });
const textResult = await parser.getText();
await parser.destroy();
console.log(textResult.text);
```
For a complete list of configuration options, see:

- [DocumentInitParameters](./README.options.md#documentinitparameters) - document initialization options
- [ParseParameters](./README.options.md#parseparameters) - parse options


Usage Examples:
- Parse password protected PDF:  [`password.test.ts`](test/test-example/password.test.ts)
- Parse only specific pages: [`specific-pages.test.ts`](test/test-example/specific-pages.test.ts)
- Parse embedded hyperlinks: [`hyperlink.test.ts`](test/test-example/hyperlink.test.ts)
- Set verbosity level: [`password.test.ts`](test/test-example/password.test.ts)
- Load PDF from URL: [`url.test.ts`](test/test-example/url.test.ts)
- Load PDF from base64 data: [`base64.test.ts`](test/test-example/base64.test.ts)
- Loading large files (> 10 MB): [`large-file.test.ts`](test/test-example/large-file.test.ts)

### `getScreenshot` — Render Pages as PNG
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile, writeFile } from 'node:fs/promises';

const buffer = await readFile('test/test-01/test.pdf');

const parser = new PDFParse({ data: buffer });
const result = await parser.getScreenshot();
await parser.destroy();

for (const pageData of result.pages) {
    const imgFileName = `page_${pageData.pageNumber}.png`;
    await writeFile(imgFileName, pageData.data, { flag: 'w' });
}
```

### `getImage` — Extract Embedded Images
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile, writeFile } from 'node:fs/promises';

const buffer = await readFile('test/test-01/test.pdf');

const parser = new PDFParse({ data: buffer });
const result = await parser.getImage();
await parser.destroy();

for (const pageData of result.pages) {
    for (const pageImage of pageData.images) {
        const imgFileName = `page_${pageData.pageNumber}-${pageImage.fileName}.png`;
        await writeFile(imgFileName, pageImage.data, { flag: 'w' });
    }
}
```

### `getTable` — Extract Tabular Data
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';
import { readFile } from 'node:fs/promises';

const buffer = await readFile('test/test-01/test.pdf');

const parser = new PDFParse({ data: buffer });
const result = await parser.getTable();
await parser.destroy();

for (const pageData of result.pages) {
    for (const table of pageData.tables) {
        console.log(table);
    }
}
```  

## Worker Configuration (Node.js/Backend)

In Node.js environments, `pdf-parse` automatically handles the worker configuration. However, in certain scenarios—such as custom builds, Electron/NW.js, monorepos (pnpm/yarn workspaces), or specific deployment environments—you may need to manually configure the worker source.

> **Note:** If you encounter "Invalid URL" errors with worker imports and need to manually configure the worker source, please open an issue. Normally, you don't need this configuration as it's handled automatically.

When using CommonJS in Node.js, you need to convert the worker path to a `file://` URL to avoid module resolution issues:

```js
const { PDFParse } = require('pdf-parse');
const { pathToFileURL } = require('url');

// Resolve the worker module path
const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');

// Convert to file:// URL for Node.js dynamic import compatibility
const workerUrl = pathToFileURL(workerPath).href;

// Set worker before creating PDFParse instances
PDFParse.setWorker(workerUrl);

// Now you can use PDFParse
```

For ES Modules in Node.js, you can use `import.meta.resolve` (Node.js 20.6+) or construct the path manually:

```js
import { PDFParse } from 'pdf-parse';
import { pathToFileURL } from 'url';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Option 1: Using import.meta.resolve (Node.js 20.6+)
const workerUrl = pathToFileURL(
    fileURLToPath(await import.meta.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs'))
).href;

// Option 2: Manual path resolution (compatible with older Node.js versions)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workerPath = resolve(__dirname, 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
const workerUrl = pathToFileURL(workerPath).href;

// Set worker before creating PDFParse instances
PDFParse.setWorker(workerUrl);

// Now you can use PDFParse
```

## Error Handling
```js
const parser = new PDFParse({ data: buffer });
try {
    const result = await parser.getText();
} catch (error) {
    console.error('PDF parsing failed:', error);
} finally {
    // Always call destroy() to free memory
    await parser.destroy();
}
```  

## Web / Browser <a href="https://www.jsdelivr.com/package/npm/pdf-parse" target="_blank"><img align="right" src="https://img.shields.io/jsdelivr/npm/hm/pdf-parse"></a>  
- Can be integrated into `React`, `Vue`, `Angular`, or any other web framework.
- **Live Demo:** [`https://mehmet-kozan.github.io/pdf-parse/`](https://mehmet-kozan.github.io/pdf-parse/)
- **Demo Source Code:** [`gh-pages branch`](https://github.com/mehmet-kozan/pdf-parse/tree/gh-pages)

### CDN Usage  

```html
<!-- ES Module -->
<script type="module">
  import { PDFParse } from 'https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf-parse.es.min.js';
</script>
```


| Bundle Type | Development | Production (Minified) |
|------------|-------------|----------------------|
| **ES Module** | `pdf-parse.es.js` | `pdf-parse.es.min.js` |
| **UMD/Global** | `pdf-parse.umd.js` | `pdf-parse.umd.min.js` |

**CDN Options: https://www.jsdelivr.com/package/npm/pdf-parse**

- `https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf-parse.es.js`
- `https://cdn.jsdelivr.net/npm/pdf-parse@2.2.7/dist/browser/pdf-parse.es.min.js`
- `https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf-parse.umd.js`
- `https://cdn.jsdelivr.net/npm/pdf-parse@2.2.7/dist/browser/pdf-parse.es.umd.js`



### Worker Configuration

In browser environments, `pdf-parse` requires a separate worker file to process PDFs in a background thread. By default, `pdf-parse` automatically loads the worker from the jsDelivr CDN. However, you can configure a custom worker source if needed.

**When to Configure Worker Source:**
- Using a custom build of `pdf-parse`
- Self-hosting worker files for security or offline requirements
- Using a different CDN provider

**Available Worker Files:**

- `https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf.worker.mjs`
- `https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf.worker.min.mjs`

See [`example/basic.html`](example/basic.html) for a working example of browser usage with worker configuration.








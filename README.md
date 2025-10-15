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

## Getting Started with v2 (Coming from v1)
```js
// v1
const pdf = require('pdf-parse');
pdf(buffer).then(result => console.log(result.text));

// v2
const { PDFParse } = require('pdf-parse');
// or use the bundled build 
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
- [`Security Policy`](https://github.com/mehmet-kozan/pdf-parse?tab=security-ov-file#security-policy)
- Retrieve headers and validate PDF : [`getHeader`](#getheader)
- Extract document info : [`getInfo`](#getinfo--extract-metadata-and-document-information)
- Extract page text : [`getText`](#gettext--extract-text) 
- Render pages as PNG : [`getScreenshot`](#getscreenshot--render-pages-as-png)
- Extract embedded images : [`getImage`](#getimage--extract-embedded-images)
- Detect and extract tabular data : [`getTable`](#gettable--extract-tabular-data) 
- Well-covered with [`unit tests`](./test)
- [`Integration tests`](./test_integration) to validate end-to-end behavior across environments.
- See [DocumentInitParameters](./README.options.md#documentinitparameters) and [ParseParameters](./README.options.md#parseparameters) for all available options.
- For usage examples, see [`live_demo`](./reports_site/live_demo/), [`example`](./example/), [`test`](./test/) and [`test/example`](./test/test-example/) folders.
- Serverless-ready, see [`Next.js + Vercel`](https://github.com/mehmet-kozan/vercel-next-app-demo), Netlify, AWS Lambda, Cloudflare Workers.


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

### `getHeader`
```js
// Node / ESM
import { PDFParse } from 'pdf-parse';

const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });
// HEAD request to retrieve HTTP headers and file size without downloading the full file.
// Pass `true` to check PDF magic bytes via range request
const headerResult = await parser.getHeader(true);

console.log(`Status: ${headerResult.status}`);
console.log(`Content-Length: ${headerResult.size}`);
console.log(`Is PDF: ${headerResult.isPdf}`);
console.log(`Headers:`, headerResult.headers);
```
```js
// The getHeader function can also be used directly 
// without creating a PDFParse instance by importing it from pdf-parse.
import { getHeader } from 'pdf-parse';
const headerResult = await getHeader('https://bitcoin.org/bitcoin.pdf', true); 
```
Usage Examples:
- Optionally validates PDFs by fetching the first 4 bytes (magic bytes).
- Useful for checking file existence, size, and type before full parsing.
- For URL-based PDFs, ensure CORS is configured if used in browsers.


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

// Links, pageLabel, width, height (when `parsePageInfo` is true)
console.log(`Per-page information: ${info.pages}`);

```

Usage Examples:
- Parse hyperlinks from pages: [`test/test-01-get-info`](test/test-01-get-info/get-info.test.ts)
- To extract hyperlinks, pass `{ parsePageInfo: true }`

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
- Loading large files (> 5 MB): [`large-file.test.ts`](test/test-example/large-file.test.ts)

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

Usage Examples:
- Limit output resolution or specific pages using [ParseParameters](./README.options.md#parseparameters)
- `getScreenshot({scale:1.5})` — Increase rendering scale (higher DPI / larger image)
- `getScreenshot({desiredWidth:1024})` — Request a target width in pixels; height scales to keep aspect ratio
- `imageDataUrl` (default: `true`) — include base64 data URL string in the result.
- `imageBuffer` (default: `true`) — include a binary buffer for each image.
- Select specific pages with `partial` (e.g. `getScreenshot({ partial: [1,3] })`) 
- `partial` overrides `first`/`last`.
- Use `first` to render the first N pages (e.g. `getScreenshot({ first: 3 })`).
- Use `last` to render the last N pages (e.g. `getScreenshot({ last: 2 })`).
- When both `first` and `last` are provided they form an inclusive range (`first..last`).

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
        const imgFileName = `page_${pageData.pageNumber}-${pageImage.name}.png`;
        await writeFile(imgFileName, pageImage.data, { flag: 'w' });
    }
}
```

Usage Examples:
- Exclude images width or height <= 50 px: `getImage({ imageThreshold: 50 })`
- Default `imageThreshold` is `80` (pixels)
- Useful for excluding tiny decorative or tracking images.
- To disable size-based filtering and include all images, set `imageThreshold: 0`.
- `imageDataUrl` (default: `true`) — include base64 data URL string in the result.
- `imageBuffer` (default: `true`) — include a binary buffer for each image.
- Extract images from specific pages: `getImage({ partial: [2,4] })`



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

## Worker Configuration (Node Backend / Serverless Platforms / Next.js & Vercel)

Edge Functions, Serverless Functions, AWS Lambda, Netlify Functions, or Cloudflare Workers may require additional worker configuration.

This will most likely resolve all worker-related issues.
```js
import {PDFParse} from "pdf-parse";
import "pdf-parse/worker"; // use this for serverless platforms
// or commonjs
// require('pdf-parse/worker');

```

To ensure `pdf-parse` works correctly with Next.js (especially on serverless platforms like Vercel), add the following configuration to your `next.config.ts` file. This allows Next.js to include `pdf-parse` as an external package for server-side usage:

```js
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
```

> **Note:** Similar configuration may be required for other serverless platforms (such as AWS Lambda, Netlify, or Cloudflare Workers) to ensure that `pdf-parse` and its worker files are properly included and executed in your deployment environment.

Custom builds, Electron/NW.js, or specific deployment environments—you may need to manually configure the worker source.

```js
import {PDFParse} from "pdf-parse";
import {getWorkerPath, getWorkerSource} from "pdf-parse/worker";
// CommonJS
// const {getWorkerSource, getWorkerPath} = require('pdf-parse/worker');

PDFParse.setWorker(getWorkerPath());
// or PDFParse.setWorker(getWorkerSource());

```


## Error Handling
```js
import { PDFParse, VerbosityLevel } from 'pdf-parse';

const parser = new PDFParse({ data: buffer, verbosity: VerbosityLevel.WARNINGS });

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
- **Demo Source:** [`reports_site/live_demo`](reports_site/live_demo)

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

See [`example/basic.esm.worker.html`](example/basic.esm.worker.html) for a working example of browser usage with worker configuration.

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

## Contributing

 When opening an issue, please attach the relevant PDF file if possible. Providing the file will help us reproduce and resolve your issue more efficiently. For detailed guidelines on how to contribute, report bugs, or submit pull requests, see: [`contributing to pdf-parse`](https://github.com/mehmet-kozan/pdf-parse?tab=contributing-ov-file#contributing-to-pdf-parse)









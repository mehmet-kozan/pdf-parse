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
// const pdf = require('pdf-parse');
// pdf(buffer).then(result => console.log(result.text));

// v2
const { PDFParse } = require('pdf-parse');
// import { PDFParse } from 'pdf-parse';

async function run() {
	const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });

	const result = await parser.getText();
	console.log(result.text);
}

run();
```  

## Features <a href="https://mehmet-kozan.github.io/pdf-parse/" target="_blank"><img align="right" src="https://img.shields.io/badge/live-demo-brightgreen.svg" alt="demo"></a>

- CJS, ESM, Node.js, and browser support.
- Can be integrated with `React`, `Vue`, `Angular`, or any other web framework.
- **Command-line interface** for quick PDF processing: [`CLI Documentation`](./docs/README.cli.md)
- [`Security Policy`](https://github.com/mehmet-kozan/pdf-parse?tab=security-ov-file#security-policy)
- Retrieve headers and validate PDF : [`getHeader`](#getheader--node-utility-pdf-header-retrieval-and-validation)
- Extract document info : [`getInfo`](#getinfo--extract-metadata-and-document-information)
- Extract page text : [`getText`](#gettext--extract-text) 
- Render pages as PNG : [`getScreenshot`](#getscreenshot--render-pages-as-png)
- Extract embedded images : [`getImage`](#getimage--extract-embedded-images)
- Detect and extract tabular data : [`getTable`](#gettable--extract-tabular-data) 
- Well-covered with [`unit tests`](./tests)
- [`Integration tests`](./tests/integration) to validate end-to-end behavior across environments.
- See [DocumentInitParameters](./docs/README.options.md#documentinitparameters) and [ParseParameters](./docs/README.options.md#parseparameters) for all available options.
- Examples: [`live demo`](./reports/demo/), [`examples`](./examples/), [`tests`](./tests/unit/) and [`tests example`](./tests/unit/test-example/) folders.
- Supports: [`Next.js + Vercel`](https://github.com/mehmet-kozan/vercel-next-app-demo), Netlify, AWS Lambda, Cloudflare Workers.


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

### CLI Installation

For command-line usage, install the package globally:

```sh
npm install -g pdf-parse
```

Or use it directly with npx:

```sh
npx pdf-parse --help
```

For detailed CLI documentation and usage examples, see: [CLI Documentation](./docs/README.cli.md)

## Usage

### `getHeader` — Node Utility: PDF Header Retrieval and Validation

```js
// Important: getHeader is available from the 'pdf-parse/node' submodule
import { getHeader } from 'pdf-parse/node';

// Retrieve HTTP headers and file size without downloading the full file.
// Pass `true` to check PDF magic bytes via range request.
// Optionally validates PDFs by fetching the first 4 bytes (magic bytes).
// Useful for checking file existence, size, and type before full parsing.
// Node only, will not work in browser environments.
const result = await getHeader('https://bitcoin.org/bitcoin.pdf', true);

console.log(`Status: ${result.status}`);
console.log(`Content-Length: ${result.size}`);
console.log(`Is PDF: ${result.isPdf}`);
console.log(`Headers:`, result.headers);
```

### `getInfo` — Extract Metadata and Document Information

```js
import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

const link = 'https://mehmet-kozan.github.io/pdf-parse/pdf/climate.pdf';
// const buffer = await readFile('reports/pdf/climate.pdf');
// const parser = new PDFParse({ data: buffer });

const parser = new PDFParse({ url: link });
const result = await parser.getInfo({ parsePageInfo: true });
await parser.destroy();

console.log(`Total pages: ${result.total}`);
console.log(`Title: ${result.info?.Title}`);
console.log(`Author: ${result.info?.Author}`);
console.log(`Creator: ${result.info?.Creator}`);
console.log(`Producer: ${result.info?.Producer}`);

// Access parsed date information
const dates = result.getDateNode();
console.log(`Creation Date: ${dates.CreationDate}`);
console.log(`Modification Date: ${dates.ModDate}`);

// Links, pageLabel, width, height (when `parsePageInfo` is true)
console.log('Per-page information:');
console.log(JSON.stringify(result.pages, null, 2));
```

### `getText` — Extract Text

```js
import { PDFParse } from 'pdf-parse';

const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });
const result = await parser.getText();
// to extract text from page 3 only:
// const result = await parser.getText({ partial: [3] });
await parser.destroy();
console.log(result.text);
```
For a complete list of configuration options, see:

- [DocumentInitParameters](./docs/README.options.md#documentinitparameters) - document initialization options
- [ParseParameters](./docs/README.options.md#parseparameters) - parse options


Usage Examples:
- Parse password protected PDF:  [`password.test.ts`](tests/unit/test-example/password.test.ts)
- Parse only specific pages: [`specific-pages.test.ts`](tests/unit/test-example/specific-pages.test.ts)
- Parse embedded hyperlinks: [`hyperlink.test.ts`](tests/unit/test-example/hyperlink.test.ts)
- Set verbosity level: [`password.test.ts`](tests/unit/test-example/password.test.ts)
- Load PDF from URL: [`url.test.ts`](tests/unit/test-example/url.test.ts)
- Load PDF from base64 data: [`base64.test.ts`](tests/unit/test-example/base64.test.ts)
- Loading large files (> 5 MB): [`large-file.test.ts`](tests/unit/test-example/large-file.test.ts)

### `getScreenshot` — Render Pages as PNG

```js
import { readFile, writeFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

const link = 'https://bitcoin.org/bitcoin.pdf';
// const buffer = await readFile('reports/pdf/bitcoin.pdf');
// const parser = new PDFParse({ data: buffer });

const parser = new PDFParse({ url: link });

// scale:1 for original page size.
// scale:1.5 50% bigger.
const result = await parser.getScreenshot({ scale: 1.5 });

await parser.destroy();
await writeFile('bitcoin.png', result.pages[0].data);
```

Usage Examples:
- Limit output resolution or specific pages using [ParseParameters](./docs/README.options.md#parseparameters)
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
import { readFile, writeFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

const link = new URL('https://mehmet-kozan.github.io/pdf-parse/pdf/image-test.pdf');
// const buffer = await readFile('reports/pdf/image-test.pdf');
// const parser = new PDFParse({ data: buffer });

const parser = new PDFParse({ url: link });
const result = await parser.getImage();
await parser.destroy();

await writeFile('adobe.png', result.pages[0].images[0].data);
```

Usage Examples:
- Exclude images with width or height <= 50 px: `getImage({ imageThreshold: 50 })`
- Default `imageThreshold` is `80` (pixels)
- Useful for excluding tiny decorative or tracking images.
- To disable size-based filtering and include all images, set `imageThreshold: 0`.
- `imageDataUrl` (default: `true`) — include base64 data URL string in the result.
- `imageBuffer` (default: `true`) — include a binary buffer for each image.
- Extract images from specific pages: `getImage({ partial: [2,4] })`



### `getTable` — Extract Tabular Data

```js
import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

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
```

## Exception Handling & Type Usage

```ts
import type { DocumentInitParameters, ParseParameters, TextResult } from 'pdf-parse';
import { PasswordException, PDFParse, VerbosityLevel } from 'pdf-parse';

const initParams: DocumentInitParameters = {
	url: 'https://mehmet-kozan.github.io/pdf-parse/pdf/password-123456.pdf',
	verbosity: VerbosityLevel.WARNINGS,
	password: 'abcdef',
};

const parseParams: ParseParameters = {
	first: 1,
};

// Initialize the parser class without executing any code yet
const parser = new PDFParse(initParams);

function handleResult(result: TextResult) {
	console.log(result.text);
}

try {
	const result = await parser.getText(parseParams);
	handleResult(result);
} catch (error) {
	// InvalidPDFException
	// PasswordException
	// FormatError
	// ResponseException
	// AbortException
	// UnknownErrorException
	if (error instanceof PasswordException) {
		console.error('Password must be 123456\n', error);
	}
} finally {
	// Always call destroy() to free memory
	await parser.destroy();
}

``` 

## Web / Browser <a href="https://www.jsdelivr.com/package/npm/pdf-parse" target="_blank"><img align="right" src="https://img.shields.io/jsdelivr/npm/hm/pdf-parse"></a>

- Can be integrated into `React`, `Vue`, `Angular`, or any other web framework.
- **Live Demo:** [`https://mehmet-kozan.github.io/pdf-parse/`](https://mehmet-kozan.github.io/pdf-parse/)
- **Demo Source:** [`reports/demo`](reports/demo)
- **ES Module**:  `pdf-parse.es.js` **UMD/Global**: `pdf-parse.umd.js`

### CDN Usage

```html
<!-- ES Module -->
<script type="module">
  import {PDFParse} from 'https://cdn.jsdelivr.net/npm/pdf-parse@latest/+esm';
  const parser = new PDFParse({url:'https://mehmet-kozan.github.io/pdf-parse/pdf/bitcoin.pdf'});
  const result = await parser.getText()
  console.log(result.text)
</script>
```

**CDN Options: https://www.jsdelivr.com/package/npm/pdf-parse**

- `https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf-parse.es.js`
- `https://cdn.jsdelivr.net/npm/pdf-parse@2.4.4/dist/pdf-parse/web/pdf-parse.es.js`
- `https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf-parse.umd.js`
- `https://cdn.jsdelivr.net/npm/pdf-parse@2.4.4/dist/pdf-parse/web/pdf-parse.umd.js`


## Worker Configuration (Node / Serverless Platforms)

 Next.js & Vercel, Edge Functions, Serverless Functions, AWS Lambda, Netlify Functions, or Cloudflare Workers may require additional worker configuration.

This will most likely resolve all worker-related issues.
```js
import 'pdf-parse/worker'; // Import this before importing "pdf-parse"
import {PDFParse} from 'pdf-parse';

// or CommonJS
require ('pdf-parse/worker'); // Import this before importing "pdf-parse"
const {PDFParse} = require('pdf-parse');
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
// Import this before importing "pdf-parse"
import {getPath, getData} from "pdf-parse/worker"; 
import {PDFParse} from "pdf-parse";

// CommonJS
// const {getWorkerSource, getWorkerPath} = require('pdf-parse/worker');

PDFParse.setWorker(getPath());
// or PDFParse.setWorker(getData());

```


## Similar Packages

* [pdf2json](https://www.npmjs.com/package/pdf2json) — Buggy, memory leaks, uncatchable errors in some PDF files.
* [pdfdataextract](https://www.npmjs.com/package/pdfdataextract) — `pdf-parse`-based
* [unpdf](https://www.npmjs.com/package/unpdf) — `pdf-parse`-based
* [pdf-extract](https://www.npmjs.com/package/pdf-extract) — Non-cross-platform, depends on xpdf
* [j-pdfjson](https://www.npmjs.com/package/j-pdfjson) — Fork of pdf2json
* [pdfreader](https://www.npmjs.com/package/pdfreader) — Uses pdf2json
* [pdf-extract](https://www.npmjs.com/package/pdf-extract) — Non-cross-platform, depends on xpdf  

> **Benchmark Note:** The benchmark currently runs only against `pdf2json`. I don't know the current state of `pdf2json` — the original reason for creating `pdf-parse` was to work around stability issues with `pdf2json`. I deliberately did not include `pdf-parse` or other `pdf.js`-based packages in the benchmark because dependencies conflict. If you have recommendations for additional packages to include, please open an issue, see [`benchmark results`](https://mehmet-kozan.github.io/pdf-parse/benchmark.html).

## Supported Node.js Versions(20.x, 22.x, 23.x, 24.x)

- Supported: Node.js 20 (>= 20.16.0), Node.js 22 (>= 22.3.0), Node.js 23 (>= 23.0.0), and Node.js 24 (>= 24.0.0).
- Not supported: Node.js 21.x, and Node.js 19.x and earlier.

Integration tests run on Node.js 20–24, see [`test_integration.yml`](./.github/workflows/test_integration.yml).

### Unsupported Node.js Versions (18.x, 19.x, 21.x)

Requires additional setup — import and configure a compatible CanvasFactory or worker implementation before initializing pdf-parse; see the examples below.

ESM 
```js
// Import this before importing "pdf-parse"
import { CanvasFactory } from 'pdf-parse/worker'; 
import { PDFParse } from 'pdf-parse';

const parser = new PDFParse({ data: buffer, CanvasFactory });
// then use parser
```

CJS
```js
// Import this before importing "pdf-parse"
const { CanvasFactory } = require('pdf-parse/worker'); 
const { PDFParse } = require('pdf-parse');

const parser = new PDFParse({ data: buffer, CanvasFactory });
// then use parser
```

## Contributing

 When opening an issue, please attach the relevant PDF file if possible. Providing the file will help us reproduce and resolve your issue more efficiently. For detailed guidelines on how to contribute, report bugs, or submit pull requests, see: [`contributing to pdf-parse`](https://github.com/mehmet-kozan/pdf-parse?tab=contributing-ov-file#contributing-to-pdf-parse)









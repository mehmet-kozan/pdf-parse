# Troubleshooting

This guide provides solutions to common issues encountered when using `pdf-parse`, especially related to worker configuration, canvas factory, Node.js versions, and deployment environments.


## 1. DOMMatrix is not defined
This error occurs when DOMMatrix is not available in the Node.js environment. To fix:

```js
// Import this before importing "pdf-parse"
import { CanvasFactory } from 'pdf-parse/worker';
import { PDFParse } from 'pdf-parse';

const parser = new PDFParse({ data: buffer, CanvasFactory });
```

## 2. Error: require() of ES Module
This happens when trying to require an ES module. Ensure you're using import statements or configure your environment to handle ES modules properly.

- For Node.js, add `"type": "module"` or `"type": "commonjs"`.

```js
// Import this before importing "pdf-parse"
import { getPath, getData } from 'pdf-parse/worker';
import { PDFParse } from 'pdf-parse';

PDFParse.setWorker(getData());
// or
// PDFParse.setWorker(getPath());
```

## 3. Error: Cannot find module 'pdf-parse' or '@napi-rs/canvas'

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

Load moduels for serverless enviroment:
```js
// next.config.ts for vercel deploy
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
};

export default nextConfig;
```

> **Note:** Similar configuration may be required for other serverless platforms (such as AWS Lambda, Netlify, or Cloudflare Workers) to ensure that `pdf-parse` and its worker files are properly included and executed in your deployment environment.

## 4. Error: Setting up fake worker failed
This indicates issues with worker initialization. Try manually setting the worker:

```js
// Import this before importing "pdf-parse"
import { getPath, getData } from 'pdf-parse/worker';
import { PDFParse } from 'pdf-parse';

PDFParse.setWorker(getPath());
// or
// PDFParse.setWorker(getData());
```

## 5. TypeError: process.getBuiltinModule is not a function
This error occurs on older Node.js versions. Upgrade to Node.js (20+, 22+, 23+, 24+) or use a compatible canvas implementation. Import and configure a compatible CanvasFactory or worker implementation before initializing pdf-parse; see the examples below.

ESM 
```js
// Import this before importing "pdf-parse"
import { CanvasFactory } from 'pdf-parse/worker'; 
import { PDFParse } from 'pdf-parse';

const parser = new PDFParse({ data: buffer, CanvasFactory });
// then use parser
```


## 6. Error: No "GlobalWorkerOptions.workerSrc" or Invalid URL
Set the worker source explicitly:

```js
// Import this before importing "pdf-parse"
import { getPath, getData } from 'pdf-parse/worker';
import { PDFParse } from 'pdf-parse';

PDFParse.setWorker(getPath());
// or
// PDFParse.setWorker(getData());
```

## Supported Node.js Versions(20.x, 22.x, 23.x, 24.x)

- Supported: Node.js 20 (>= 20.16.0), Node.js 22 (>= 22.3.0), Node.js 23 (>= 23.0.0), and Node.js 24 (>= 24.0.0).
- Not supported: Node.js 21.x, and Node.js 19.x and earlier.

Integration tests run on Node.js 20–24, see [`test_integration.yml`](../.github/workflows/test_integration.yml).

### Unsupported Node.js Versions (18.x, 19.x, 21.x)

Import and configure a compatible CanvasFactory or worker implementation before initializing pdf-parse; see the examples below.

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

Unsupported tests run on Node.js 18, 19, 21, see [`test_integration.yml`](../.github/workflows/test_unsupported.yml).

## General Advice
- Ensure your deployment platform supports the required Node.js version and dependencies.
- For custom builds, Electron/NW.js, or specific deployment environments, you may need to manually configure the worker source.

If you continue to experience issues, please check the [GitHub Issues](https://github.com/mehmet-kozan/pdf-parse/issues) page or open a new issue with details about your environment and error messages.

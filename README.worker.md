## Worker Configuration (Node.js / Backend)

If you only need the default behavior you can ignore worker configuration — `pdf-parse` will automatically configure the worker for most environments. If you need advanced or platform-specific instructions, see: [`README.worker.md`](./README.worker.md)

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

### When you actually need to set the worker

- Custom builds where the worker cannot be resolved automatically
- Monorepo/workspace setups where `node_modules` layout differs (pnpm, yarn PnP)
- Electron/NW.js packaging with non-standard import paths
- Self-hosting worker files for offline or security requirements

If you don't need to set a custom worker, you can ignore this file — `pdf-parse` will pick a sensible default.

* https://github.com/adobe-type-tools/cmap-resources
* https://mozilla.github.io/pdf.js/examples/



```js

    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    const isCJS = typeof require !== 'undefined' && typeof module !== 'undefined' && typeof module.exports !== 'undefined';
    const isESM = typeof window === 'undefined' && typeof require === 'undefined';


    if (isBrowser) {
        //pdfjs.GlobalWorkerOptions.workerSrc = worker;
    } else if (isCJS) {
        if (typeof worker === 'string' && worker.startsWith('data:text/javascript')) {
            //pdfjs.GlobalWorkerOptions.workerSrc = worker;
        }
    } else if (isESM) {
        // For ESM in Node.js, the worker is imported at the top of the file
        // to prevent "Invalid URL" error when using pnpm workspaces or ESM
        // Import worker for ESM in Node.js to prevent "Invalid URL" error
        // biome-ignore lint/suspicious/noExplicitAny: <worker module import>
        // import('pdfjs-dist/legacy/build/pdf.worker.mjs' as any).catch(() => {
        // 	// Worker import is optional, pdfjs will fall back to inline worker
        // });
    }

```


```js
//A) Tek test dosyasında (CJS AVA test) — import sorunu yaşamadan önce workerSrc ayarlamak 
//(test dosyanın başına koy; kesinlikle pdfjs veya sizin modülünüzü require/import etmeden önce çalıştırılmalı)
// test/setup-before-pdf.js  (CJS test runner için)
const { pathToFileURL } = require('url');

// resolve worker module to absolute path
const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
// set PDF.js worker src to a file:// URL that Node's dynamic import understands
// note: dynamic import() in pdf.js will get this file URL and import it.
(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  // export if you need globally:
  globalThis._pdfjs_for_tests = pdfjs;
})();
```

```js
//B) Eğer test dosyan CJS ise ve modülünü import etmeden önce ayarlamak istersen:

// test/common.test.cjs
const { pathToFileURL } = require('url');
const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');

before(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  // şimdi pdf modülünü (sizin index/dist) require/import et
  // ör: globalThis.PDFParse = (await import('../dist/cjs/index.cjs')).default;
});
```


```js
//C) ESM test ortamı için (top-level await var ise):
import { pathToFileURL } from 'url';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(new URL(import.meta.resolve ? await import.meta.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs') : 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;

```
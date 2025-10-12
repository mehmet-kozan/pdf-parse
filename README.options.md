## DocumentInitParameters

| Name | Type | Attributes | Description |
|------|------|------------|-------------|
| `url` | `string \| URL` | *optional* | The URL of the PDF. |
| `data` | `TypedArray \| ArrayBuffer \| Array<number> \| string` | *optional* | Binary PDF data. Use TypedArrays (e.g., `Uint8Array`) to improve memory usage. If PDF data is BASE64-encoded, use `atob()` to convert it to a binary string first. **NOTE**: If TypedArrays are used, they will generally be transferred to the worker thread, reducing main-thread memory usage but taking ownership of the array. |
| `httpHeaders` | `Object` | *optional* | Basic authentication headers. |
| `withCredentials` | `boolean` | *optional* | Indicates whether cross-site Access-Control requests should be made using credentials (e.g., cookies or auth headers). Default: `false`. |
| `password` | `string` | *optional* | For decrypting password-protected PDFs. |
| `length` | `number` | *optional* | The PDF file length. Used for progress reports and range requests. |
| `range` | `PDFDataRangeTransport` | *optional* | Allows using a custom range transport implementation. |
| `rangeChunkSize` | `number` | *optional* | Maximum number of bytes fetched per range request. Default: `65536` (`2^16`). |
| `worker` | `PDFWorker` | *optional* | The worker used for loading and parsing PDF data. |
| `verbosity` | `number` | *optional* | Controls logging level; use constants from `VerbosityLevel`. |
| `docBaseUrl` | `string` | *optional* | Base URL of the document, used to resolve relative URLs in annotations and outline items. |
| `cMapUrl` | `string` | *optional* | URL where predefined Adobe CMaps are located. Include trailing slash. |
| `cMapPacked` | `boolean` | *optional* | Specifies if Adobe CMaps are binary-packed. Default: `true`. |
| `CMapReaderFactory` | `Object` | *optional* | Factory for reading built-in CMap files. Default: `{DOMCMapReaderFactory}`. |
| `iccUrl` | `string` | *optional* | URL where predefined ICC profiles are located. Include trailing slash. |
| `useSystemFonts` | `boolean` | *optional* | If `true`, non-embedded fonts fall back to system fonts. Default: `true` in browsers, `false` in Node.js (unless `disableFontFace === true`, then always `false`). |
| `standardFontDataUrl` | `string` | *optional* | URL for standard font files. Include trailing slash. |
| `StandardFontDataFactory` | `Object` | *optional* | Factory for reading standard font files. Default: `{DOMStandardFontDataFactory}`. |
| `wasmUrl` | `string` | *optional* | URL for WebAssembly files. Include trailing slash. |
| `WasmFactory` | `Object` | *optional* | Factory for reading WASM files. Default: `{DOMWasmFactory}`. |
| `useWorkerFetch` | `boolean` | *optional* | Enable `fetch()` in worker thread for CMap/font/WASM files. If `true`, factory options are ignored. Default: `true` in browsers, `false` in Node.js. |
| `useWasm` | `boolean` | *optional* | Attempt to use WebAssembly for better performance (e.g., image decoding). Default: `true`. |
| `stopAtErrors` | `boolean` | *optional* | Reject promises (e.g., `getTextContent`) on parse errors instead of recovering partially. Default: `false`. |
| `maxImageSize` | `number` | *optional* | Max image size in total pixels (`width * height`). Use `-1` for no limit (default). |
| `isEvalSupported` | `boolean` | *optional* | Whether evaluating strings as JS is allowed (for PDF function performance). Default: `true`. |
| `isOffscreenCanvasSupported` | `boolean` | *optional* | Whether `OffscreenCanvas` can be used in worker. Default: `true` in browsers, `false` in Node.js. |
| `isImageDecoderSupported` | `boolean` | *optional* | Whether `ImageDecoder` can be used in worker. Default: `true` in browsers, `false` in Node.js. **NOTE**: Temporarily disabled in Chromium due to bugs:<br>- Crashes with BMP decoder on huge images ([issue 374807001](https://issues.chromium.org/issues/374807001))<br>- Broken JPEGs with custom color profiles ([issue 378869810](https://issues.chromium.org/issues/378869810)) |
| `canvasMaxAreaInBytes` | `number` | *optional* | Used to determine when to resize images (via `OffscreenCanvas`). Use `-1` to use a slower fallback algorithm. |
| `disableFontFace` | `boolean` | *optional* | Disable `@font-face`/Font Loading API; use built-in glyph renderer instead. Default: `false` in browsers, `true` in Node.js. |
| `fontExtraProperties` | `boolean` | *optional* | Include extra (non-rendering) font properties when exporting font data from worker. Increases memory usage. Default: `false`. |
| `enableXfa` | `boolean` | *optional* | Render XFA forms if present. Default: `false`. |
| `ownerDocument` | `HTMLDocument` | *optional* | Explicit document context for creating elements and loading resources. Defaults to current document. |
| `disableRange` | `boolean` | *optional* | Disable range requests for PDF loading. Default: `false`. |
| `disableStream` | `boolean` | *optional* | Disable streaming PDF data. Default: `false`. |
| `disableAutoFetch` | `boolean` | *optional* | Disable pre-fetching of PDF data. Requires `disableStream: true` to work fully. Default: `false`. |
| `pdfBug` | `boolean` | *optional* | Enable debugging hooks (see `web/debugger.js`). Default: `false`. |
| `CanvasFactory` | `Object` | *optional* | Factory for creating canvases. Default: `{DOMCanvasFactory}`. |
| `FilterFactory` | `Object` | *optional* | Factory for creating SVG filters during rendering. Default: `{DOMFilterFactory}`. |
| `enableHWA` | `boolean` | *optional* | Enable hardware acceleration for rendering. Default: `false`. |

## ParseParameters

| Name | Type | Attributes | Description |
|------|------|------------|-------------|
| `partial` | `Array<number>` | *optional* | Array of 1-based page numbers to parse. When provided, only these pages will be parsed and returned in the same order as specified. Example: `[1, 3, 5]`. Parse only one page: `[7]`. |
| `first` | `number` | *optional* | If set to a positive integer N, parse the first N pages (pages 1..N). Ignored when `partial` is provided. If both `first` and `last` are set, they define an explicit inclusive page range and only pages from `first` to `last` will be parsed. In that case `first` is treated as the starting page number and the "first N" semantics is ignored. |
| `last` | `number` | *optional* | If set to a positive integer N, parse the last N pages (pages total-N+1..total). Ignored when `partial` is provided. If both `first` and `last` are set, they define an explicit inclusive page range and only pages from `first` to `last` will be parsed. In that case `last` is treated as the ending page number and the "last N" semantics is ignored. |
| `parseHyperlinks` | `boolean` | *optional* | When `true`, attempt to detect and include hyperlink annotations (e.g. URLs) associated with text. Detected links are formatted as Markdown inline links (for example: `[link text](https://example.com)`). Default: `false`. |
| `lineEnforce` | `boolean` | *optional* | When `true`, the extractor will try to enforce logical line breaks by inserting a newline between text items when the vertical distance between them exceeds `lineThreshold`. Useful to preserve paragraph/line structure when text items are emitted as separate segments by the PDF renderer. Default: `true`. |
| `lineThreshold` | `number` | *optional* | Threshold used to decide whether two nearby text items belong to different lines. A larger value makes the parser more likely to start a new line between items. Default: `4.6`. |
| `cellSeparator` | `string` | *optional* | String inserted between text items on the same line when a sufficiently large horizontal gap is detected (see `cellThreshold`). This is typically used to emulate a cell/column separator (for example, a tab). Example: `"\t"` to produce tab-separated cells. Default: `'\t'`. |
| `cellThreshold` | `number` | *optional* | Horizontal distance threshold used to decide when two text items on the same baseline should be considered separate cells (and thus separated by `cellSeparator`). A larger value produces fewer (wider) cells; smaller value creates more cell breaks. Default: `7`. |
| `pageJoiner` | `string` | *optional* | Optional string appended at the end of each page's extracted text to mark page boundaries. The string supports the placeholders `page_number` and `total_number`, which are substituted with the current page number and total page count respectively. If omitted or empty, no page boundary marker is added. Default: `'\n-- page_number of total_number --'`. |
| `itemJoiner` | `string` | *optional* | Optional string used to join text items when returning a page's text. If provided, the extractor will use this value to join the sequence of text items instead of the default empty-string joining behavior. Use this to insert a custom separator between every text item. Default: `undefined`. |
| `minImageWidth` | `number` | *optional* | Minimum image width (in pixels). When set, images with a width smaller than this value will be ignored by `getImage()`. Use to filter out very small embedded images (thumbnails, icons). Default: `undefined` (no minimum). |
| `minImageHeight` | `number` | *optional* | Minimum image height (in pixels). When set, images with a height smaller than this value will be ignored by `getImage()`. Use together with `minImageWidth` to require both dimensions to meet the threshold. Default: `undefined` (no minimum). |
| `includeMarkedContent` | `boolean` | *optional* | When `true`, include marked content items in the items array of TextContent. Enables capturing the PDF's "marked content" tags (MCID, role/props) and structural/accessibility information — e.g. semantic tagging, sectioning, spans, alternate/alternative text, etc. Turn it on when you need structure/tag information or to map text ↔ structure using MCIDs (for example with `page.getStructTree()`). For plain text extraction it's usually left `false` (trade-off: larger output/increased detail). Default: `false`. |
| `disableNormalization` | `boolean` | *optional* | When `true`, the text is *not* normalized in the worker thread. Normalize in worker (`false` recommended for plain text). Default: `false`. |


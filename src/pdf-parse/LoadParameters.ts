/** biome-ignore-all lint/complexity/noBannedTypes: for underline types */

import type { DocumentInitParameters, PDFDataRangeTransport, PDFWorker } from 'pdfjs-dist/types/src/display/api.js';

export type { PDFDataRangeTransport, PDFWorker };

//  ERRORS: 0, WARNINGS: 1, INFOS: 5
export enum VerbosityLevel {
	/**
	 * logs all errors
	 */
	ERRORS = 0,
	/**
	 * logs all infos
	 */
	INFOS = 5,
	/**
	 * logs all warnings
	 */
	WARNINGS = 1,
}

/**
 * @public
 * LoadParameters
 * PDF loading parameters.
 */
export interface LoadParameters extends DocumentInitParameters {
	/**
	 * The URL of the PDF.
	 * Default: `undefined`.
	 */
	url?: string | URL | undefined;
	/**
	 * Binary PDF data.
	 * Use TypedArrays (e.g., `Uint8Array`) to improve memory usage. If PDF data is BASE64-encoded, use `atob()` to convert it to a binary string first.
	 * **NOTE**: If TypedArrays are used, they will generally be transferred to the worker thread, reducing main-thread memory usage but taking ownership of the array.
	 * Default: `undefined`.
	 */
	data?: string | number[] | ArrayBuffer | TypedArray | undefined;
	/**
	 * Basic authentication headers.
	 * Default: `undefined`.
	 */
	httpHeaders?: Object | undefined;
	/**
	 * Indicates whether cross-site Access-Control requests should be made using credentials (e.g., cookies or auth headers).
	 * Default: `false`.
	 */
	withCredentials?: boolean | undefined;
	/**
	 * For decrypting password-protected PDFs.
	 * Default: `undefined`.
	 */
	password?: string | undefined;
	/**
	 * The PDF file length. Used for progress reports and range requests.
	 * Default: `undefined`.
	 */
	length?: number | undefined;
	/**
	 * Allows using a custom range transport implementation.
	 * Default: `undefined`.
	 */
	range?: PDFDataRangeTransport | undefined;
	/**
	 * Maximum number of bytes fetched per range request.
	 * Default: `65536` (`2^16`).
	 */
	rangeChunkSize?: number | undefined;
	/**
	 * The worker used for loading and parsing PDF data.
	 * Default: `undefined`.
	 */
	worker?: PDFWorker | undefined;
	/**
	 * Controls logging level; use constants from `VerbosityLevel`.
	 * Default: `undefined`.
	 */
	verbosity?: VerbosityLevel | undefined;
	/**
	 * Base URL of the document, used to resolve relative URLs in annotations and outline items.
	 * Default: `undefined`.
	 */
	docBaseUrl?: string | undefined;
	/**
	 * URL where predefined Adobe CMaps are located. Include trailing slash.
	 * Default: `undefined`.
	 */
	cMapUrl?: string | undefined;
	/**
	 * Specifies if Adobe CMaps are binary-packed.
	 * Default: `true`.
	 */
	cMapPacked?: boolean | undefined;
	/**
	 * Factory for reading built-in CMap files.
	 * Default: `{DOMCMapReaderFactory}`.
	 */
	CMapReaderFactory?: Object | undefined;
	/**
	 * URL where predefined ICC profiles are located. Include trailing slash.
	 * Default: `undefined`.
	 */
	iccUrl?: string | undefined;
	/**
	 * If `true`, non-embedded fonts fall back to system fonts.
	 * Default: `true` in browsers, `false` in Node.js (unless `disableFontFace === true`, then always `false`).
	 */
	useSystemFonts?: boolean | undefined;
	/**
	 * URL for standard font files. Include trailing slash.
	 * Default: `undefined`.
	 */
	standardFontDataUrl?: string | undefined;
	/**
	 * Factory for reading standard font files.
	 * Default: `{DOMStandardFontDataFactory}`.
	 */
	StandardFontDataFactory?: Object | undefined;
	/**
	 * URL for WebAssembly files. Include trailing slash.
	 * Default: `undefined`.
	 */
	wasmUrl?: string | undefined;
	/**
	 * Factory for reading WASM files.
	 * Default: `{DOMWasmFactory}`.
	 */
	WasmFactory?: Object | undefined;
	/**
	 * Enable `fetch()` in worker thread for CMap/font/WASM files. If `true`, factory options are ignored.
	 * Default: `true` in browsers, `false` in Node.js.
	 */
	useWorkerFetch?: boolean | undefined;
	/**
	 * Attempt to use WebAssembly for better performance (e.g., image decoding).
	 * Default: `true`.
	 */
	useWasm?: boolean | undefined;
	/**
	 * Reject promises (e.g., `getTextContent`) on parse errors instead of recovering partially.
	 * Default: `false`.
	 */
	stopAtErrors?: boolean | undefined;
	/**
	 * Max image size in total pixels (`width * height`). Use `-1` for no limit.
	 * Default: `-1`.
	 */
	maxImageSize?: number | undefined;
	/**
	 * Whether evaluating strings as JS is allowed (for PDF function performance).
	 * Default: `true`.
	 */
	isEvalSupported?: boolean | undefined;
	/**
	 * Whether `OffscreenCanvas` can be used in worker.
	 * Default: `true` in browsers, `false` in Node.js.
	 */
	isOffscreenCanvasSupported?: boolean | undefined;
	/**
	 * Whether `ImageDecoder` can be used in worker.
	 * Default: `true` in browsers, `false` in Node.js.
	 * **NOTE**: Temporarily disabled in Chromium due to bugs:
	 * - Crashes with BMP decoder on huge images ([issue 374807001](https://issues.chromium.org/issues/374807001))
	 * - Broken JPEGs with custom color profiles ([issue 378869810](https://issues.chromium.org/issues/378869810))
	 */
	isImageDecoderSupported?: boolean | undefined;
	/**
	 * Used to determine when to resize images (via `OffscreenCanvas`). Use `-1` to use a slower fallback algorithm.
	 * Default: `undefined`.
	 */
	canvasMaxAreaInBytes?: number | undefined;
	/**
	 * Disable `@font-face`/Font Loading API; use built-in glyph renderer instead.
	 * Default: `false` in browsers, `true` in Node.js.
	 */
	disableFontFace?: boolean | undefined;
	/**
	 * Include extra (non-rendering) font properties when exporting font data from worker. Increases memory usage.
	 * Default: `false`.
	 */
	fontExtraProperties?: boolean | undefined;
	/**
	 * Render XFA forms if present.
	 * Default: `false`.
	 */
	enableXfa?: boolean | undefined;
	/**
	 * Explicit document context for creating elements and loading resources. Defaults to current document.
	 * Default: `undefined`.
	 */
	ownerDocument?: HTMLDocument | undefined;
	/**
	 * Disable range requests for PDF loading.
	 * Default: `false`.
	 */
	disableRange?: boolean | undefined;
	/**
	 * Disable streaming PDF data.
	 * Default: `false`.
	 */
	disableStream?: boolean | undefined;
	/**
	 * Disable pre-fetching of PDF data. Requires `disableStream: true` to work fully.
	 * Default: `false`.
	 */
	disableAutoFetch?: boolean | undefined;
	/**
	 * Enable debugging hooks (see `web/debugger.js`).
	 * Default: `false`.
	 */
	pdfBug?: boolean | undefined;
	/**
	 * Factory for creating canvases.
	 * Default: `{DOMCanvasFactory}`.
	 */
	CanvasFactory?: Object | undefined;
	/**
	 * Factory for creating SVG filters during rendering.
	 * Default: `{DOMFilterFactory}`.
	 */
	FilterFactory?: Object | undefined;
	/**
	 * Enable hardware acceleration for rendering.
	 * Default: `false`.
	 */
	enableHWA?: boolean | undefined;
}

export type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array;

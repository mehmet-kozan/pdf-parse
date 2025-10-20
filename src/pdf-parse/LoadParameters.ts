/** biome-ignore-all lint/complexity/noBannedTypes: for underline types */

/**
 * @public
 * LoadParameters
 * PDF loading parameters.
 */
export type LoadParameters = {
	/**
	 * - The URL of the PDF.
	 */
	url?: string | URL | undefined;
	/**
	 * -
	 * Binary PDF data.
	 * Use TypedArrays (Uint8Array) to improve the memory usage. If PDF data is
	 * BASE64-encoded, use `atob()` to convert it to a binary string first.
	 *
	 * NOTE: If TypedArrays are used they will generally be transferred to the
	 * worker-thread. This will help reduce main-thread memory usage, however
	 * it will take ownership of the TypedArrays.
	 */
	data?: string | number[] | ArrayBuffer | TypedArray | undefined;
	/**
	 * - Basic authentication headers.
	 */
	httpHeaders?: Object | undefined;
	/**
	 * - Indicates whether or not
	 * cross-site Access-Control requests should be made using credentials such
	 * as cookies or authorization headers. The default is `false`.
	 */
	withCredentials?: boolean | undefined;
	/**
	 * - For decrypting password-protected PDFs.
	 */
	password?: string | undefined;
	/**
	 * - The PDF file length. It's used for progress
	 * reports and range requests operations.
	 */
	length?: number | undefined;
	/**
	 * - Allows for using a custom range
	 * transport implementation.
	 */
	range?: Object | undefined;
	/**
	 * - Specify maximum number of bytes fetched
	 * per range request. The default value is 65536 (= 2^16).
	 */
	rangeChunkSize?: number | undefined;
	/**
	 * - The worker that will be used for loading and
	 * parsing the PDF data.
	 */
	worker?: Object | undefined;
	/**
	 * - Controls the logging level; the constants
	 * from {@link VerbosityLevel} should be used.
	 */
	verbosity?: number | undefined;
	/**
	 * - The base URL of the document, used when
	 * attempting to recover valid absolute URLs for annotations, and outline
	 * items, that (incorrectly) only specify relative URLs.
	 */
	docBaseUrl?: string | undefined;
	/**
	 * - The URL where the predefined Adobe CMaps are
	 * located. Include the trailing slash.
	 */
	cMapUrl?: string | undefined;
	/**
	 * - Specifies if the Adobe CMaps are binary
	 * packed or not. The default value is `true`.
	 */
	cMapPacked?: boolean | undefined;
	/**
	 * - The factory that will be used when
	 * reading built-in CMap files.
	 * The default value is {DOMCMapReaderFactory}.
	 */
	CMapReaderFactory?: Object | undefined;
	/**
	 * - The URL where the predefined ICC profiles are
	 * located. Include the trailing slash.
	 */
	iccUrl?: string | undefined;
	/**
	 * - When `true`, fonts that aren't
	 * embedded in the PDF document will fallback to a system font.
	 * The default value is `true` in web environments and `false` in Node.js;
	 * unless `disableFontFace === true` in which case this defaults to `false`
	 * regardless of the environment (to prevent completely broken fonts).
	 */
	useSystemFonts?: boolean | undefined;
	/**
	 * - The URL where the standard font
	 * files are located. Include the trailing slash.
	 */
	standardFontDataUrl?: string | undefined;
	/**
	 * - The factory that will be used
	 * when reading the standard font files.
	 * The default value is {DOMStandardFontDataFactory}.
	 */
	StandardFontDataFactory?: Object | undefined;
	/**
	 * - The URL where the wasm files are located.
	 * Include the trailing slash.
	 */
	wasmUrl?: string | undefined;
	/**
	 * - The factory that will be used
	 * when reading the wasm files.
	 * The default value is {DOMWasmFactory}.
	 */
	WasmFactory?: Object | undefined;
	/**
	 * - Enable using the Fetch API in the
	 * worker-thread when reading CMap and standard font files. When `true`,
	 * the `CMapReaderFactory`, `StandardFontDataFactory`, and `WasmFactory`
	 * options are ignored.
	 * The default value is `true` in web environments and `false` in Node.js.
	 */
	useWorkerFetch?: boolean | undefined;
	/**
	 * - Attempt to use WebAssembly in order to
	 * improve e.g. image decoding performance.
	 * The default value is `true`.
	 */
	useWasm?: boolean | undefined;
	/**
	 * - Reject certain promises, e.g.
	 * `getOperatorList`, `getTextContent`, and `RenderTask`, when the associated
	 * PDF data cannot be successfully parsed, instead of attempting to recover
	 * whatever possible of the data. The default value is `false`.
	 */
	stopAtErrors?: boolean | undefined;
	/**
	 * - The maximum allowed image size in total
	 * pixels, i.e. width * height. Images above this value will not be rendered.
	 * Use -1 for no limit, which is also the default value.
	 */
	maxImageSize?: number | undefined;
	/**
	 * - Determines if we can evaluate strings
	 * as JavaScript. Primarily used to improve performance of PDF functions.
	 * The default value is `true`.
	 */
	isEvalSupported?: boolean | undefined;
	/**
	 * - Determines if we can use
	 * `OffscreenCanvas` in the worker. Primarily used to improve performance of
	 * image conversion/rendering.
	 * The default value is `true` in web environments and `false` in Node.js.
	 */
	isOffscreenCanvasSupported?: boolean | undefined;
	/**
	 * - Determines if we can use
	 * `ImageDecoder` in the worker. Primarily used to improve performance of
	 * image conversion/rendering.
	 * The default value is `true` in web environments and `false` in Node.js.
	 *
	 * NOTE: Also temporarily disabled in Chromium browsers, until we no longer
	 * support the affected browser versions, because of various bugs:
	 *
	 * - Crashes when using the BMP decoder with huge images, e.g. issue6741.pdf;
	 * see https://issues.chromium.org/issues/374807001
	 *
	 * - Broken images when using the JPEG decoder with images that have custom
	 * colour profiles, e.g. GitHub discussion 19030;
	 * see https://issues.chromium.org/issues/378869810
	 */
	isImageDecoderSupported?: boolean | undefined;
	/**
	 * - The integer value is used to
	 * know when an image must be resized (uses `OffscreenCanvas` in the worker).
	 * If it's -1 then a possibly slow algorithm is used to guess the max value.
	 */
	canvasMaxAreaInBytes?: number | undefined;
	/**
	 * - By default fonts are converted to
	 * OpenType fonts and loaded via the Font Loading API or `@font-face` rules.
	 * If disabled, fonts will be rendered using a built-in font renderer that
	 * constructs the glyphs with primitive path commands.
	 * The default value is `false` in web environments and `true` in Node.js.
	 */
	disableFontFace?: boolean | undefined;
	/**
	 * - Include additional properties,
	 * which are unused during rendering of PDF documents, when exporting the
	 * parsed font data from the worker-thread. This may be useful for debugging
	 * purposes (and backwards compatibility), but note that it will lead to
	 * increased memory usage. The default value is `false`.
	 */
	fontExtraProperties?: boolean | undefined;
	/**
	 * - Render Xfa forms if any.
	 * The default value is `false`.
	 */
	enableXfa?: boolean | undefined;
	/**
	 * - Specify an explicit document
	 * context to create elements with and to load resources, such as fonts,
	 * into. Defaults to the current document.
	 */
	ownerDocument?: HTMLDocument | undefined;
	/**
	 * - Disable range request loading of PDF
	 * files. When enabled, and if the server supports partial content requests,
	 * then the PDF will be fetched in chunks. The default value is `false`.
	 */
	disableRange?: boolean | undefined;
	/**
	 * - Disable streaming of PDF file data.
	 * By default PDF.js attempts to load PDF files in chunks. The default value
	 * is `false`.
	 */
	disableStream?: boolean | undefined;
	/**
	 * - Disable pre-fetching of PDF file
	 * data. When range requests are enabled PDF.js will automatically keep
	 * fetching more data even if it isn't needed to display the current page.
	 * The default value is `false`.
	 *
	 * NOTE: It is also necessary to disable streaming, see above, in order for
	 * disabling of pre-fetching to work correctly.
	 */
	disableAutoFetch?: boolean | undefined;
	/**
	 * - Enables special hooks for debugging PDF.js
	 * (see `web/debugger.js`). The default value is `false`.
	 */
	pdfBug?: boolean | undefined;
	/**
	 * - The factory that will be used when
	 * creating canvases. The default value is {DOMCanvasFactory}.
	 */
	CanvasFactory?: Object | undefined;
	/**
	 * - The factory that will be used to
	 * create SVG filters when rendering some images on the main canvas.
	 * The default value is {DOMFilterFactory}.
	 */
	FilterFactory?: Object | undefined;
	/**
	 * - Enables hardware acceleration for
	 * rendering. The default value is `false`.
	 */
	enableHWA?: boolean | undefined;
};

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

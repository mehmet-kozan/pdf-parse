import type { PageViewport, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { BaseCanvasFactory } from 'pdfjs-dist/types/src/display/canvas_factory.js';
import type { PDFObjects } from 'pdfjs-dist/types/src/display/pdf_objects.js';

import { getException } from './Exception.js';
import { getHeaderRequest, type HeaderResult } from './HeaderResult.js';
import { ImageResult, type PageImages } from './ImageResult.js';
import { InfoResult, type PageData } from './info/index.js';
import { type LoadParameters, VerbosityLevel } from './LoadParameters.js';
import { type ParseParameters, setDefaultParseParameters } from './ParseParameters.js';
import { ScreenshotResult } from './ScreenshotResult.js';
import { type HyperlinkPosition, TextResult } from './TextResult.js';
import { setVerbosityLevel } from './Utils.js';

// biome-ignore lint/suspicious/noExplicitAny: pdfjs
if (typeof (globalThis as any).pdfjs === 'undefined') {
	// biome-ignore lint/suspicious/noExplicitAny: pdfjs
	(globalThis as any).pdfjs = pdfjs;
}

export { pdfjs };
export type { PDFPageProxy };

/**
 * @public
 * Loads PDF documents and exposes helpers for text, image, table, metadata, and screenshot extraction.
 */
export class PDFParse {
	protected readonly options: LoadParameters;
	protected doc: PDFDocumentProxy | undefined;
	public progress: { loaded: number; total: number } = { loaded: -1, total: 0 };

	get verbosity(): VerbosityLevel {
		this.options.verbosity = this.options.verbosity ?? VerbosityLevel.ERRORS;
		return this.options.verbosity;
	}

	set verbosity(value: VerbosityLevel | undefined) {
		this.options.verbosity = value ?? VerbosityLevel.ERRORS;
		setVerbosityLevel(value);
	}

	/**
	 * Create a new parser with `LoadParameters`.
	 * Converts Node.js `Buffer` data to `Uint8Array` automatically and ensures a default verbosity level.
	 * @param options - Initialization parameters.
	 */
	constructor(options: LoadParameters) {
		this.options = options;
		this.verbosity = options.verbosity;

		if (typeof Buffer !== 'undefined' && options.data instanceof Buffer) {
			this.options.data = new Uint8Array(options.data);
		}
	}

	public async destroy() {
		if (this.doc) {
			await this.doc.destroy();
			this.doc = undefined;
		}
	}

	// biome-ignore-start lint/suspicious/noExplicitAny: unsupported underline type
	public static get isNodeJS(): boolean {
		const isNodeJS =
			typeof process === 'object' &&
			`${process}` === '[object process]' &&
			!process.versions.nw &&
			!(
				process.versions.electron &&
				typeof (process as any).type !== 'undefined' &&
				(process as any).type !== 'browser'
			);

		return isNodeJS;
	}

	public static setWorker(workerSrc?: string): string {
		if (pdfjs?.GlobalWorkerOptions === null) return '';

		if (workerSrc !== undefined) {
			pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
			return pdfjs.GlobalWorkerOptions.workerSrc;
		}

		// if (!PDFParse.isNodeJS) {
		// 	pdfjs.GlobalWorkerOptions.workerSrc =
		// 		'https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf.worker.min.mjs';
		// 	return pdfjs.GlobalWorkerOptions.workerSrc;
		// }

		return pdfjs.GlobalWorkerOptions.workerSrc;
	}
	// biome-ignore-end lint/suspicious/noExplicitAny: unsupported underline type

	/**
	 * Perform an HTTP HEAD request to retrieve the file size and verify existence;
	 * when `check` is true, fetch a small range and inspect the magic number to confirm the URL points to a valid PDF.
	
	 * @param check - When `true`, download a small byte range (first 4 bytes) to validate the file signature by checking for '%PDF' magic bytes. Default: `false`.
	 * @returns - A Promise that resolves to a HeaderResult object containing the response status, size, headers, and PDF validation result.
	 * @public
	 */
	public async getHeader(check: boolean): Promise<HeaderResult> {
		if (this.options.url) {
			return await getHeaderRequest(this.options.url, check);
		}

		if (this.options.data instanceof Uint8Array) {
			const bytes = this.options.data.subarray(0, 4);
			const headerStr = new TextDecoder().decode(bytes);
			const validPdf = headerStr.startsWith('%PDF');
			const ok = validPdf === true;

			return {
				ok,
				validPdf,
				fileSize: this.options.data.byteLength,
			};
		}

		throw new Error('Either `LoadParameters url` (string) or `data` must be provided.');
	}

	/**
	 * Load document-level metadata (info, outline, permissions, page labels) and optionally gather per-page link details.
	 * @param params - Parse options; set `parsePageInfo` to collect per-page metadata described in `ParseParameters`.
	 * @returns Aggregated document metadata in an `InfoResult`.
	 */
	public async getInfo(params: ParseParameters = {}): Promise<InfoResult> {
		const doc = await this.load();

		const result = new InfoResult(doc.numPages);
		await result.load(doc);

		if (params.parsePageInfo) {
			const pageLabels = await doc.getPageLabels();
			for (let i: number = 1; i <= result.total; i++) {
				if (this.shouldParse(i, result.total, params)) {
					const page = await doc.getPage(i);

					const pageLinkResult = await this.getPageLinks(page);
					pageLinkResult.pageLabel = pageLabels?.[page.pageNumber];
					result.pages.push(pageLinkResult);
					page.cleanup();
				}
			}
		}

		return result;
	}

	private async getPageLinks(page: PDFPageProxy): Promise<PageData> {
		const viewport = page.getViewport({ scale: 1 });

		const result: PageData = {
			pageNumber: page.pageNumber,
			links: [],
			width: viewport.width,
			height: viewport.height,
		};

		// 'display' (viewable annotations),
		// 'print' (printable annotations),
		// 'any' (all annotations). The default value is 'display'.
		// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
		const annotations: Array<any> = (await page.getAnnotations({ intent: 'display' })) || [];

		for (const i of annotations) {
			if (i.subtype !== 'Link') continue;

			const url: string = i.url ?? i.unsafeUrl;
			if (!url) continue;

			const text: string = i.overlaidText || '';

			result.links.push({ url, text });
		}

		return result;
	}

	/**
	 * getRaw — Extract raw text for v1 compatibility.
	 *
	 * This method extracts plain (raw) text for each requested page and applies
	 * v1-compatible defaults: `lineEnforce: false`, `pageJoiner: ''`, and `cellSeparator: ''`.
	 * It uses the same underlying implementation as `getText`
	 * but forces those defaults to reproduce the historical v1 behavior
	 * (no enforced line joining, no page joiner text, and no cellseparators).
	 *
	 * @param params - `ParseParameters` controlling page selection, hyperlink
	 *   handling, and line/cell thresholds.
	 * @returns A `TextResult` containing per-page text entries and a combined
	 *   document text string.
	 */
	public async getRaw(params: ParseParameters = {}): Promise<TextResult> {
		const paramsV1: ParseParameters = {
			lineEnforce: false,
			pageJoiner: '',
			cellSeparator: '',
		};

		return await this.getText({ ...params, ...paramsV1 });
	}

	/**
	 * Extract plain text for each requested page, optionally enriching hyperlinks and enforcing line or cell separators.
	 * @param params - Parse options controlling pagination, link handling, and line/cell thresholds.
	 * @returns A `TextResult` containing page-wise text and a concatenated document string.
	 */
	public async getText(params: ParseParameters = {}): Promise<TextResult> {
		const doc = await this.load();
		const result = new TextResult(doc.numPages);

		for (let i: number = 1; i <= result.total; i++) {
			if (this.shouldParse(i, result.total, params)) {
				const page = await doc.getPage(i);
				const text = await this.getPageText(page, params);
				result.pages.push({
					text: text,
					num: i,
				});
				page.cleanup();
			}
		}

		for (const page of result.pages) {
			if (params.pageJoiner) {
				let pageNumber = params.pageJoiner.replace('page_number', `${page.num}`);
				pageNumber = pageNumber.replace('total_number', `${result.total}`);
				result.text += `${page.text}\n${pageNumber}\n\n`;
			} else {
				result.text += `${page.text}\n\n`;
			}
		}

		return result;
	}

	protected async load(): Promise<PDFDocumentProxy> {
		try {
			if (this.doc === undefined) {
				const loadingTask = pdfjs.getDocument(this.options);

				loadingTask.onProgress = (progress: { loaded: number; total: number }) => {
					this.progress = progress;
				};

				this.doc = await loadingTask.promise;
			}

			return this.doc;
		} catch (error) {
			throw getException(error);
		}
	}

	protected shouldParse(currentPage: number, totalPage: number, params: ParseParameters): boolean {
		params.partial = params?.partial ?? [];
		params.first = params?.first ?? 0;
		params.last = params?.last ?? 0;

		// parse specific pages
		if (params.partial.length > 0) {
			if (params.partial.includes(currentPage)) {
				return true;
			}
			return false;
		}

		// parse pagest beetween first..last
		if (params.first > 0 && params.last > 0) {
			if (currentPage >= params.first && currentPage <= params.last) {
				return true;
			}
			return false;
		}

		// parse first x page
		if (params.first > 0) {
			if (currentPage <= params.first) {
				return true;
			}
			return false;
		}

		// parse last x page
		if (params.last > 0) {
			if (currentPage > totalPage - params.last) {
				return true;
			}
			return false;
		}

		return true;
	}

	private async getPageText(page: PDFPageProxy, parseParams: ParseParameters): Promise<string> {
		const viewport = page.getViewport({ scale: 1 });

		const params = setDefaultParseParameters(parseParams);

		const textContent = await page.getTextContent({
			includeMarkedContent: !!params.includeMarkedContent,
			disableNormalization: !!params.disableNormalization,
		});

		let links: Map<string, HyperlinkPosition[]> = new Map();

		if (params.parseHyperlinks) {
			links = await this.getHyperlinks(page, viewport);
		}

		const strBuf: Array<string> = [];

		let lastX: number | undefined;
		let lastY: number | undefined;
		let lineHeight: number = 0;

		for (const item of textContent.items) {
			if (!('str' in item)) continue;

			const tm = item.transform ?? item.transform;
			const [x, y] = viewport.convertToViewportPoint(tm[4], tm[5]);

			if (params.parseHyperlinks) {
				const posArr = links.get(item.str) || [];
				const hit = posArr.find((l) => x >= l.rect.left && x <= l.rect.right && y >= l.rect.top && y <= l.rect.bottom);
				if (hit) {
					item.str = `[${item.str}](${hit.url})`;
				}
			}

			if (params.lineEnforce) {
				if (lastY !== undefined && Math.abs(lastY - y) > params.lineThreshold) {
					const lastItem = strBuf.length ? strBuf[strBuf.length - 1] : undefined;
					const isCurrentItemHasNewLine = item.str.startsWith('\n') || (item.str.trim() === '' && item.hasEOL);

					if (lastItem?.endsWith('\n') === false && !isCurrentItemHasNewLine) {
						const ydiff = Math.abs(lastY - y);

						if (ydiff - 1 > lineHeight) {
							strBuf.push('\n');
							lineHeight = 0;
						}
					}
				}
			}

			if (params.cellSeparator) {
				if (lastY !== undefined && Math.abs(lastY - y) < params.lineThreshold) {
					if (lastX !== undefined && Math.abs(lastX - x) > params.cellThreshold) {
						item.str = `${params.cellSeparator}${item.str}`;
					}
				}
			}

			strBuf.push(item.str);
			lastX = x + item.width;
			lastY = y;
			lineHeight = Math.max(lineHeight, item.height);

			if (item.hasEOL) {
				strBuf.push('\n');
			}

			if (item.hasEOL || item.str.endsWith('\n')) {
				lineHeight = 0;
			}
		}

		if (params.itemJoiner) {
			return strBuf.join(params.itemJoiner);
		}

		return strBuf.join('');
	}

	private async getHyperlinks(page: PDFPageProxy, viewport: PageViewport): Promise<Map<string, HyperlinkPosition[]>> {
		const result: Map<string, HyperlinkPosition[]> = new Map();

		// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
		const annotations: Array<any> = (await page.getAnnotations({ intent: 'display' })) || [];

		for (const i of annotations) {
			if (i.subtype !== 'Link') continue;

			const url: string = i.url ?? i.unsafeUrl;
			if (!url) continue;

			const text: string = i.overlaidText;
			if (!text) continue;

			const rectVp = viewport.convertToViewportRectangle(i.rect);
			const left = Math.min(rectVp[0], rectVp[2]) - 0.5;
			const top = Math.min(rectVp[1], rectVp[3]) - 0.5;
			const right = Math.max(rectVp[0], rectVp[2]) + 0.5;
			const bottom = Math.max(rectVp[1], rectVp[3]) + 0.5;

			const pos: HyperlinkPosition = { rect: { left, top, right, bottom }, url, text, used: false };

			const el = result.get(text);
			if (el) {
				el.push(pos);
			} else {
				result.set(text, [pos]);
			}
		}

		return result;
	}

	/**
	 * Extract embedded images from requested pages.
	 *
	 * Behavior notes:
	 * - Pages are selected according to ParseParameters (partial, first, last).
	 * - Images smaller than `params.imageThreshold` (width OR height) are skipped.
	 * - Returned ImageResult contains per-page PageImages; each image entry includes:
	 *     - data: Uint8Array (present when params.imageBuffer === true)
	 *     - dataUrl: string (present when params.imageDataUrl === true)
	 *     - width, height, kind, name
	 * - Works in both Node.js (canvas.toBuffer) and browser (canvas.toDataURL) environments.
	 *
	 * @param params - ParseParameters controlling page selection, thresholds and output format.
	 * @returns Promise<ImageResult> with extracted images grouped by page.
	 */
	public async getImage(params: ParseParameters = {}): Promise<ImageResult> {
		const doc = await this.load();
		const result = new ImageResult(doc.numPages);
		setDefaultParseParameters(params);

		for (let i: number = 1; i <= result.total; i++) {
			if (this.shouldParse(i, result.total, params)) {
				const page = await doc.getPage(i);
				const ops = await page.getOperatorList();

				const pageImages: PageImages = { pageNumber: i, images: [] };
				result.pages.push(pageImages);

				for (let j = 0; j < ops.fnArray.length; j++) {
					if (ops.fnArray[j] === pdfjs.OPS.paintInlineImageXObject || ops.fnArray[j] === pdfjs.OPS.paintImageXObject) {
						const name = ops.argsArray[j][0];
						const isCommon = page.commonObjs.has(name);
						const imgPromise = isCommon
							? this.resolveEmbeddedImage(page.commonObjs, name)
							: this.resolveEmbeddedImage(page.objs, name);

						const { width, height, kind, data } = await imgPromise;

						if (params.imageThreshold) {
							if (params.imageThreshold >= width || params.imageThreshold >= height) {
								continue;
							}
						}

						// biome-ignore lint/suspicious/noExplicitAny: <underlying library does not contain valid typedefs>
						const canvasFactory = (doc as any).canvasFactory;

						const canvasAndContext = canvasFactory.create(width, height);
						const context = canvasAndContext.context;
						let imgData = null;
						if (kind === pdfjs.ImageKind.RGBA_32BPP) {
							imgData = context.createImageData(width, height);
							imgData.data.set(data);
						} else {
							imgData = context.createImageData(width, height);
							this.convertToRGBA({
								src: data,
								dest: new Uint32Array(imgData.data.buffer),
								width,
								height,
								kind,
							});
						}
						context.putImageData(imgData, 0, 0);

						// Browser and Node.js compatibility
						let buffer: Uint8Array = new Uint8Array();
						let dataUrl: string = '';

						if (typeof canvasAndContext.canvas.toBuffer === 'function') {
							// Node.js environment (canvas package)
							// biome-ignore lint/suspicious/noExplicitAny: <underline lib not support>
							let nodeBuffer: any;

							if (params.imageBuffer) {
								nodeBuffer = canvasAndContext.canvas.toBuffer('image/png');
								buffer = new Uint8Array(nodeBuffer);
							}

							if (params.imageDataUrl) {
								if (nodeBuffer) {
									dataUrl = `data:image/png;base64,${nodeBuffer.toString('base64')}`;
								} else {
									nodeBuffer = canvasAndContext.canvas.toBuffer('image/png');
									buffer = new Uint8Array(nodeBuffer);
									dataUrl = `data:image/png;base64,${nodeBuffer.toString('base64')}`;
								}
							}
						} else {
							// Browser environment
							if (params.imageBuffer) {
								const imageData = canvasAndContext.context.getImageData(
									0,
									0,
									canvasAndContext.canvas.width,
									canvasAndContext.canvas.height,
								);
								buffer = new Uint8Array(imageData.data);
							}

							if (params.imageDataUrl) {
								dataUrl = canvasAndContext.canvas.toDataURL('image/png');
							}
						}

						pageImages.images.push({
							data: buffer,
							dataUrl,
							name,
							height,
							width,
							kind,
						});
					}
				}
			}
		}

		return result;
	}

	private convertToRGBA({
		src,
		dest,
		width,
		height,
		kind,
	}: {
		src: Uint8Array;
		dest: Uint32Array;
		width: number;
		height: number;
		kind: number;
	}) {
		if (kind === pdfjs.ImageKind.RGB_24BPP) {
			// RGB 24-bit per pixel
			for (let i = 0, j = 0; i < src.length; i += 3, j++) {
				const r = src[i];
				const g = src[i + 1];
				const b = src[i + 2];
				dest[j] = (255 << 24) | (b << 16) | (g << 8) | r;
			}
		} else if (kind === pdfjs.ImageKind.GRAYSCALE_1BPP) {
			// Grayscale 1-bit per pixel
			let pixelIndex = 0;
			for (let i = 0; i < src.length; i++) {
				const byte = src[i];
				for (let bit = 7; bit >= 0; bit--) {
					if (pixelIndex >= width * height) break;
					const isWhite = ((byte >> bit) & 1) === 1;
					const gray = isWhite ? 255 : 0;
					dest[pixelIndex++] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
				}
			}
		} else if (kind === undefined || kind === null) {
			// Unknown or undefined kind - try to infer from data length
			const bytesPerPixel = src.length / (width * height);
			if (Math.abs(bytesPerPixel - 3) < 0.1) {
				// Likely RGB 24BPP
				for (let i = 0, j = 0; i < src.length; i += 3, j++) {
					const r = src[i];
					const g = src[i + 1];
					const b = src[i + 2];
					dest[j] = (255 << 24) | (b << 16) | (g << 8) | r;
				}
			} else if (Math.abs(bytesPerPixel - 4) < 0.1) {
				// Likely RGBA 32BPP
				for (let i = 0, j = 0; i < src.length; i += 4, j++) {
					const r = src[i];
					const g = src[i + 1];
					const b = src[i + 2];
					const a = src[i + 3];
					dest[j] = (a << 24) | (b << 16) | (g << 8) | r;
				}
			} else if (Math.abs(bytesPerPixel - 1) < 0.1) {
				// Likely grayscale 8BPP
				for (let i = 0; i < src.length; i++) {
					const gray = src[i];
					dest[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
				}
			} else {
				throw new Error(
					`convertToRGBA: Cannot infer image format. kind: ${kind}, bytesPerPixel: ${bytesPerPixel}, width: ${width}, height: ${height}, dataLength: ${src.length}`,
				);
			}
		} else {
			throw new Error(
				`convertToRGBA: Unsupported image kind: ${kind}. Available kinds: GRAYSCALE_1BPP=${pdfjs.ImageKind.GRAYSCALE_1BPP}, RGB_24BPP=${pdfjs.ImageKind.RGB_24BPP}, RGBA_32BPP=${pdfjs.ImageKind.RGBA_32BPP}`,
			);
		}
	}

	private resolveEmbeddedImage(
		pdfObjects: PDFObjects,
		name: string,
	): Promise<{ width: number; height: number; kind: number; data: Uint8Array }> {
		return new Promise((resolve, reject) => {
			// biome-ignore lint/suspicious/noExplicitAny: <underlying library does not contain valid typedefs>
			pdfObjects.get(name, (imgData: any) => {
				if (imgData) {
					// Check different possible data sources
					let dataBuff: Uint8Array | undefined;

					if (imgData.data instanceof Uint8Array) {
						dataBuff = imgData.data;
					} else if (imgData.data instanceof Uint8ClampedArray) {
						dataBuff = new Uint8Array(imgData.data);
					} else if (imgData.data?.buffer) {
						// Typed array with buffer
						dataBuff = new Uint8Array(imgData.data.buffer);
					} else if (imgData.bitmap) {
						// Some browsers might use bitmap
						// biome-ignore lint/suspicious/noExplicitAny: <underlying library does not contain valid typedefs>
						const canvasFactory: BaseCanvasFactory = (this.doc as any).canvasFactory;
						const canvasAndContext = canvasFactory.create(imgData.bitmap.width, imgData.bitmap.height);
						canvasAndContext.context.drawImage(imgData.bitmap, 0, 0);
						const imageData = canvasAndContext.context.getImageData(0, 0, imgData.bitmap.width, imgData.bitmap.height);
						dataBuff = new Uint8Array(imageData.data.buffer);
					} else if (ArrayBuffer.isView(imgData.data)) {
						// Generic typed array
						dataBuff = new Uint8Array(imgData.data.buffer, imgData.data.byteOffset, imgData.data.byteLength);
					}

					if (!dataBuff) {
						reject(
							new Error(
								`Image object ${name}: data field is empty or invalid. Available fields: ${Object.keys(imgData).join(', ')}`,
							),
						);
						return;
					}

					if (dataBuff.length === 0) {
						reject(new Error(`Image object ${name}: data buffer is empty (length: 0)`));
						return;
					}

					resolve({ width: imgData.width, height: imgData.height, kind: imgData.kind, data: dataBuff });
				} else {
					reject(new Error(`Image object ${name} not found`));
				}
			});
		});
	}

	/**
	 * Render pages to raster screenshots.
	 *
	 * Behavior notes:
	 * - Pages are selected according to ParseParameters (partial, first, last).
	 * - Use params.scale for zoom; if params.desiredWidth is specified it takes precedence.
	 * - Each ScreenshotResult page contains:
	 *     - data: Uint8Array (when params.imageBuffer === true)
	 *     - dataUrl: string (when params.imageDataUrl === true)
	 *     - pageNumber, width, height, scale
	 * - Works in both Node.js (canvas.toBuffer) and browser (canvas.toDataURL) environments.
	 *
	 * @param parseParams - ParseParameters controlling page selection and render options.
	 * @returns Promise<ScreenshotResult> with rendered page images.
	 */
	public async getScreenshot(parseParams: ParseParameters = {}): Promise<ScreenshotResult> {
		//const base = new URL('../../node_modules/pdfjs-dist/', import.meta.url);
		//this.options.cMapUrl = new URL('cmaps/', base).href;
		//this.options.cMapPacked = true;
		//this.options.standardFontDataUrl = new URL('legacy/build/standard_fonts/', base).href;

		const params = setDefaultParseParameters(parseParams);

		const doc = await this.load();
		const result = new ScreenshotResult(doc.numPages);

		if (this.doc === undefined) {
			throw new Error('PDF document not loaded');
		}

		for (let i: number = 1; i <= result.total; i++) {
			if (this.shouldParse(i, result.total, params)) {
				const page = await this.doc.getPage(i);

				let viewport = page.getViewport({ scale: params.scale });
				if (params.desiredWidth) {
					viewport = page.getViewport({ scale: 1 });
					// desiredWidth
					const scale = params.desiredWidth / viewport.width;
					viewport = page.getViewport({ scale: scale });
				}

				// biome-ignore lint/suspicious/noExplicitAny: <underlying library does not contain valid typedefs>
				const canvasFactory = (this.doc as any).canvasFactory;
				const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
				const renderContext = {
					canvasContext: canvasAndContext.context,
					viewport,
					canvas: canvasAndContext.canvas,
				};

				const renderTask = page.render(renderContext);
				await renderTask.promise;
				// Convert the canvas to an image buffer.
				let data: Uint8Array = new Uint8Array();
				let dataUrl: string = '';

				if (typeof canvasAndContext.canvas.toBuffer === 'function') {
					// Node.js environment (canvas package)
					// biome-ignore lint/suspicious/noExplicitAny: <underline lib not support>
					let nodeBuffer: any;

					if (params.imageBuffer) {
						nodeBuffer = canvasAndContext.canvas.toBuffer('image/png');
						data = new Uint8Array(nodeBuffer);
					}

					if (params.imageDataUrl) {
						if (nodeBuffer) {
							dataUrl = `data:image/png;base64,${nodeBuffer.toString('base64')}`;
						} else {
							nodeBuffer = canvasAndContext.canvas.toBuffer('image/png');
							data = new Uint8Array(nodeBuffer);
							dataUrl = `data:image/png;base64,${nodeBuffer.toString('base64')}`;
						}
					}
				} else {
					// Browser environment
					if (params.imageBuffer) {
						const imageData = canvasAndContext.context.getImageData(
							0,
							0,
							canvasAndContext.canvas.width,
							canvasAndContext.canvas.height,
						);
						data = new Uint8Array(imageData.data);
					}

					if (params.imageDataUrl) {
						dataUrl = canvasAndContext.canvas.toDataURL('image/png');
						//const base64 = dataUrl.split(',')[1];
						//const binaryString = atob(base64);
						//data = new Uint8Array(binaryString.length);
						//for (let i = 0; i < binaryString.length; i++) {
						//	data[i] = binaryString.charCodeAt(i);
						//}
					}
				}

				result.pages.push({
					data,
					dataUrl,
					pageNumber: i,
					width: viewport.width,
					height: viewport.height,
					scale: viewport.scale,
				});

				page.cleanup();
			}
		}

		return result;
	}
}

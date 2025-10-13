import type { PageViewport, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { DocumentInitParameters } from 'pdfjs-dist/types/src/display/api.js';
import type { BaseCanvasFactory } from 'pdfjs-dist/types/src/display/canvas_factory.js';
import type { PDFObjects } from 'pdfjs-dist/types/src/display/pdf_objects.js';
import { Line, LineStore, Point, Rectangle } from './geometry/Geometry.js';
import type { TableData } from './geometry/TableData.js';
import { getHeader, type HeaderResult } from './HeaderResult.js';
import { ImageResult, type PageImages } from './ImageResult.js';
import { InfoResult, type PageLinkResult } from './InfoResult.js';
import { type ParseParameters, setDefaultParseParameters } from './ParseParameters.js';
import { type MinMax, PathGeometry } from './PathGeometry.js';
import { ScreenshotResult } from './ScreenshotResult.js';
import { type PageTableResult, TableResult } from './TableResult.js';
import { type HyperlinkPosition, TextResult } from './TextResult.js';

/**
 * Loads PDF documents and exposes helpers for text, image, table, metadata, and screenshot extraction.
 */
export class PDFParse {
	private readonly options: DocumentInitParameters;
	private doc: PDFDocumentProxy | undefined;
	public progress: { loaded: number; total: number } = { loaded: -1, total: 0 };

	/**
	 * Create a new parser with `DocumentInitParameters`.
	 * Converts Node.js `Buffer` data to `Uint8Array` automatically and ensures a default verbosity level.
	 * @param options Initialization parameters.
	 */
	constructor(options: DocumentInitParameters) {
		if (options.verbosity === undefined) {
			options.verbosity = pdfjs.VerbosityLevel.ERRORS;
		}

		if (typeof Buffer !== 'undefined' && options.data instanceof Buffer) {
			options.data = new Uint8Array(options.data);
		}

		this.options = options;
	}

	public async destroy() {
		if (this.doc) {
			await this.doc.destroy();
			this.doc = undefined;
		}
	}

	public static get isNodeJS(): boolean {
		const isNodeJS =
			typeof process === 'object' &&
			`${process}` === '[object process]' &&
			!process.versions.nw &&
			// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
			!(process.versions.electron && typeof (process as any).type !== 'undefined' && (process as any).type !== 'browser');

		return isNodeJS;
	}

	public static setWorker(workerSrc?: string): string {
		// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
		if (typeof (globalThis as any).pdfjs === 'undefined') {
			// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
			(globalThis as any).pdfjs = pdfjs;
		}

		if (pdfjs?.GlobalWorkerOptions === null) return '';

		if (workerSrc !== undefined) {
			pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
			return pdfjs.GlobalWorkerOptions.workerSrc;
		}

		if (!PDFParse.isNodeJS) {
			pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/browser/pdf.worker.min.mjs';
			return pdfjs.GlobalWorkerOptions.workerSrc;
		}

		return pdfjs.GlobalWorkerOptions.workerSrc;
	}

	/**
	 * Perform an HTTP HEAD request to retrieve the file size and verify existence;
	 * when `check` is true, fetch a small range and inspect the magic number to confirm the URL points to a valid PDF.
	 * @param check When `true`, download a small byte range to validate the file signature.
	 * Default: `false`.
	 */
	public async getHeader(check: boolean = false): Promise<HeaderResult> {
		if (!this.options.url) {
			throw new Error('getHeader: options.url is not set');
		}

		return await getHeader(this.options.url, check);
	}

	/**
	 * Load document-level metadata (info, outline, permissions, page labels) and optionally gather per-page link details.
	 * @param params Parse options; set `parsePageInfo` to collect per-page metadata described in `ParseParameters`.
	 * @returns Aggregated document metadata in an `InfoResult`.
	 */
	public async getInfo(params: ParseParameters = {}): Promise<InfoResult> {
		const doc = await this.load();
		const result = new InfoResult(doc.numPages);

		const { info, metadata } = await doc.getMetadata();
		result.info = info;
		result.metadata = metadata;

		result.fingerprints = doc.fingerprints;
		result.outline = await doc.getOutline();
		result.permission = await doc.getPermissions();
		const pageLabels = await doc.getPageLabels();

		if (params.parsePageInfo) {
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

	private async getPageLinks(page: PDFPageProxy): Promise<PageLinkResult> {
		const viewport = page.getViewport({ scale: 1 });

		const result: PageLinkResult = {
			pageNumber: page.pageNumber,
			links: [],
			width: viewport.width,
			height: viewport.height,
		};

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
	 * Extract plain text for each requested page, optionally enriching hyperlinks and enforcing line or cell separators.
	 * @param params Parse options controlling pagination, link handling, and line/cell thresholds.
	 * @returns A `TextResult` containing page-wise text and a concatenated document string.
	 */
	public async getText(params: ParseParameters = {}): Promise<TextResult> {
		const doc = await this.load();
		const result = new TextResult(doc.numPages);

		for (let i: number = 1; i <= result.total; i++) {
			if (this.shouldParse(i, result.total, params)) {
				const page = await doc.getPage(i);
				const text = await this.getPageText(page, params, result.total);
				result.pages.push({
					text: text,
					num: i,
				});
				page.cleanup();
			}
		}

		for (const page of result.pages) {
			result.text += `${page.text}\n\n`;
		}

		return result;
	}

	private async load(): Promise<PDFDocumentProxy> {
		if (this.doc === undefined) {
			const loadingTask = pdfjs.getDocument(this.options);

			loadingTask.onProgress = (progress: { loaded: number; total: number }) => {
				this.progress = progress;
			};

			this.doc = await loadingTask.promise;
		}

		return this.doc;
	}

	private shouldParse(currentPage: number, totalPage: number, params: ParseParameters): boolean {
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

	private async getPageText(page: PDFPageProxy, parseParams: ParseParameters, total: number): Promise<string> {
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
						strBuf.push('\n');
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

			if (item.hasEOL) {
				strBuf.push('\n');
			}
		}

		if (params.pageJoiner) {
			let pageNumber = params.pageJoiner.replace('page_number', `${page.pageNumber}`);
			pageNumber = pageNumber.replace('total_number', `${total}`);
			strBuf.push(pageNumber);
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
	 * @param params ParseParameters controlling page selection, thresholds and output format.
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
						const imgPromise = isCommon ? this.resolveEmbeddedImage(page.commonObjs, name) : this.resolveEmbeddedImage(page.objs, name);

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
								const imageData = canvasAndContext.context.getImageData(0, 0, canvasAndContext.canvas.width, canvasAndContext.canvas.height);
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

	private convertToRGBA({ src, dest, width, height, kind }: { src: Uint8Array; dest: Uint32Array; width: number; height: number; kind: number }) {
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
				throw new Error(`convertToRGBA: Cannot infer image format. kind: ${kind}, bytesPerPixel: ${bytesPerPixel}, width: ${width}, height: ${height}, dataLength: ${src.length}`);
			}
		} else {
			throw new Error(
				`convertToRGBA: Unsupported image kind: ${kind}. Available kinds: GRAYSCALE_1BPP=${pdfjs.ImageKind.GRAYSCALE_1BPP}, RGB_24BPP=${pdfjs.ImageKind.RGB_24BPP}, RGBA_32BPP=${pdfjs.ImageKind.RGBA_32BPP}`,
			);
		}
	}

	private resolveEmbeddedImage(pdfObjects: PDFObjects, name: string): Promise<{ width: number; height: number; kind: number; data: Uint8Array }> {
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
						reject(new Error(`Image object ${name}: data field is empty or invalid. Available fields: ${Object.keys(imgData).join(', ')}`));
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
	 * @param parseParams ParseParameters controlling page selection and render options.
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
						const imageData = canvasAndContext.context.getImageData(0, 0, canvasAndContext.canvas.width, canvasAndContext.canvas.height);
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

	/**
	 * Detect and extract tables from pages by analysing vector drawing operators, then populate cells with text.
	 *
	 * Behavior notes:
	 * - Scans operator lists for rectangles/lines that form table grids (uses PathGeometry and LineStore).
	 * - Normalizes detected geometry and matches positioned text to table cells.
	 * - Honors ParseParameters for page selection.
	 *
	 * @param params ParseParameters controlling which pages to analyse (partial/first/last).
	 * @returns Promise<TableResult> containing discovered tables per page.
	 */
	public async getTable(params: ParseParameters = {}): Promise<TableResult> {
		const doc = await this.load();
		const result = new TableResult(doc.numPages);

		if (this.doc === undefined) {
			throw new Error('PDF document not loaded');
		}

		for (let i: number = 1; i <= result.total; i++) {
			if (this.shouldParse(i, result.total, params)) {
				const page = await this.doc.getPage(i);
				//const viewport = page.getViewport({ scale: 1 });
				//viewport.convertToViewportPoint(0, 0);

				const store = await this.getPageTables(page);
				//const store = await this.getPageGeometry(page);

				store.normalize();

				const tableDataArr = store.getTableData();
				await this.fillPageTables(page, tableDataArr);

				for (const table of tableDataArr) {
					//if (table.cellCount < 3) continue
					const pageTableResult: PageTableResult = { num: i, tables: table.toArray() };
					result.pages.push(pageTableResult);
					//pageTableResult.tables.push(table.toData())
				}

				page.cleanup();
			}
		}

		// for (const table of Table.AllTables) {
		//     if (table.cellCount < 3) continue
		//     const str = table.toString()
		//     console.log(str)
		// }
		return result;
	}

	private getPathGeometry(mm: MinMax): PathGeometry {
		const width = mm[2] - mm[0];
		const height = mm[3] - mm[1];

		if (mm[0] === Infinity) {
			return PathGeometry.undefined;
		}

		if (width > 5 && height > 5) {
			return PathGeometry.rectangle;
		} else if (width > 5 && height === 0) {
			return PathGeometry.hline;
		} else if (width === 0 && height > 5) {
			return PathGeometry.vline;
		}

		return PathGeometry.undefined;
	}

	private async getPageTables(page: PDFPageProxy): Promise<LineStore> {
		const lineStore: LineStore = new LineStore();
		const viewport = page.getViewport({ scale: 1 });
		let transformMatrix = [1, 0, 0, 1, 0, 0];
		const transformStack: Array<Array<number>> = [];

		const opList = await page.getOperatorList();

		for (let i = 0; i < opList.fnArray.length; i++) {
			const fn = opList.fnArray[i];
			const args = opList.argsArray[i];
			const op = args?.[0] ?? 0;
			const mm = args?.[2] ?? [Infinity, Infinity, -Infinity, -Infinity];
			//const minMax = new Float32Array([Infinity, Infinity, -Infinity, -Infinity]);

			if (fn === pdfjs.OPS.constructPath) {
				if (op === pdfjs.OPS.fill) {
					//debugger;
				}
				if (op !== pdfjs.OPS.stroke) {
					continue;
				}
				const pg = this.getPathGeometry(mm);
				if (pg === PathGeometry.rectangle) {
					const rect = new Rectangle(new Point(mm[0], mm[1]), mm[2] - mm[0], mm[3] - mm[1]);
					rect.transform(transformMatrix);
					rect.transform(viewport.transform);
					lineStore.addRectangle(rect);
				} else if (pg === PathGeometry.hline || pg === PathGeometry.vline) {
					const from = new Point(mm[0], mm[1]);
					const to = new Point(mm[2], mm[3]);
					const line = new Line(from, to);
					line.transform(transformMatrix);
					line.transform(viewport.transform);
					lineStore.add(line);
				} else {
					//debugger;
				}

				// if (op === pdfjs.OPS.rectangle) {
				// 	debugger;
				// } else if (op === pdfjs.OPS.moveTo) {
				// 	debugger;
				// } else if (op === pdfjs.OPS.lineTo) {
				// 	debugger;
				// } else if (op === pdfjs.OPS.endPath) {
				// 	const combinedMatrix = pdfjs.Util.transform(viewport.transform, transformMatrix);

				// 	// while (args[1].length) {
				// 	// 	const drawOp = args[1].shift();
				// 	// 	debugger;
				// 	// }
				// } else {
				// 	//debugger;
				// }
			} else if (fn === pdfjs.OPS.setLineWidth) {
				//debugger;
			} else if (fn === pdfjs.OPS.save) {
				transformStack.push(transformMatrix);
			} else if (fn === pdfjs.OPS.restore) {
				const restoredMatrix = transformStack.pop();
				if (restoredMatrix) {
					transformMatrix = restoredMatrix;
				}
			} else if (fn === pdfjs.OPS.transform) {
				//transformMatrix = this.transform_fn(transformMatrix, args);
				transformMatrix = pdfjs.Util.transform(transformMatrix, args);
			}
		}

		return lineStore;
	}

	// private async getPageGeometry(page: PDFPageProxy): Promise<LineStore> {
	// 	const lineStore: LineStore = new LineStore();
	// 	const opList = await page.getOperatorList();

	// 	const viewport = page.getViewport({ scale: 1 });

	// 	let transformMatrix = [1, 0, 0, 1, 0, 0];
	// 	const transformStack: Array<Array<number>> = [];

	// 	let current_x: number = 0;
	// 	let current_y: number = 0;

	// 	for (let j = 0; j < opList.fnArray.length; j++) {
	// 		const fn = opList.fnArray[j];
	// 		const args = opList.argsArray[j];

	// 		if (fn === pdfjs.OPS.constructPath) {
	// 			while (args[0].length) {
	// 				const op = args[0].shift();

	// 				const combinedMatrix = pdfjs.Util.transform(viewport.transform, transformMatrix);

	// 				if (op === pdfjs.OPS.rectangle) {
	// 					const x = args[1].shift();
	// 					const y = args[1].shift();
	// 					const width = args[1].shift();
	// 					const height = args[1].shift();

	// 					if (Math.min(width, height) <= 2) {
	// 						// TODO remove
	// 						debugger;
	// 					}

	// 					const rect = new Rectangle(new Point(x, y), width, height);
	// 					rect.transform(combinedMatrix);
	// 					//rect.transform(viewport.transform);

	// 					lineStore.addRectangle(rect);
	// 				} else if (op === pdfjs.OPS.moveTo) {
	// 					current_x = args[1].shift();
	// 					current_y = args[1].shift();
	// 				} else if (op === pdfjs.OPS.lineTo) {
	// 					const x = args[1].shift();
	// 					const y = args[1].shift();

	// 					//default trasform
	// 					const from = new Point(current_x, current_y);
	// 					const to = new Point(x, y);
	// 					const line = new Line(from, to);
	// 					line.transform(combinedMatrix);
	// 					//line.transform(viewport.transform);

	// 					// // viewport transform
	// 					// const _from = viewport.convertToViewportPoint(line.from.x, line.from.y)
	// 					// const _to = viewport.convertToViewportPoint(line.to.x, line.to.y)
	// 					//
	// 					// const transformedLine = new Line(new Point(_from[0], _from[1]), new Point(_to[0], _to[1]))
	// 					lineStore.add(line);

	// 					current_x = x;
	// 					current_y = y;
	// 				}
	// 			}
	// 		} else if (fn === pdfjs.OPS.save) {
	// 			transformStack.push(transformMatrix);
	// 		} else if (fn === pdfjs.OPS.restore) {
	// 			const restoredMatrix = transformStack.pop();
	// 			if (restoredMatrix) {
	// 				transformMatrix = restoredMatrix;
	// 			}
	// 		} else if (fn === pdfjs.OPS.transform) {
	// 			//transformMatrix = this.transform_fn(transformMatrix, args);
	// 			transformMatrix = pdfjs.Util.transform(transformMatrix, args);
	// 		}
	// 	}

	// 	return lineStore;
	// }

	private async fillPageTables(page: PDFPageProxy, pageTables: Array<TableData>): Promise<void> {
		//const resultTable: Array<Table> = []

		const viewport = page.getViewport({ scale: 1 });

		// for (let i = 0; i < pageTables.length; i++) {
		//     const currentTable = pageTables[i]
		// }

		//pageTables = pageTables.filter((table) => table.cellCount > 3)

		const textContent = await page.getTextContent({
			includeMarkedContent: false,
			disableNormalization: false,
		});

		for (const textItem of textContent.items) {
			if (!('str' in textItem)) continue;

			const tx = pdfjs.Util.transform(pdfjs.Util.transform(viewport.transform, textItem.transform), [1, 0, 0, -1, 0, 0]);

			//const resXY = viewport.convertToViewportPoint(tx[4], tx[5]);
			// textItem.transform = pdfjs.Util.transform(viewport.transform, textItem.transform)
			// textItem.transform[5] = viewport.height - textItem.transform[5] - textItem.height

			for (const pageTable of pageTables) {
				const cell = pageTable.findCell(tx[4], tx[5]);
				if (cell) {
					cell.text.push(textItem.str);
					if (textItem.hasEOL) {
						cell.text.push('\n');
					}
					break;
				}
			}

			//Table.tryAddText(pageTables, textItem)
		}
	}
}

PDFParse.setWorker();

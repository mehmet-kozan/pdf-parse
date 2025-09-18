import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { PDFObjects } from 'pdfjs-dist/types/src/display/pdf_objects';
import { Line, LineStore, Point, Rectangle } from './geometry/Geometry';
import type { TableData } from './geometry/TableData';
import { type ImageResult, ImageResultDefault, type PageImages } from './ImageResult';
import type { InfoResult } from './InfoResult';
import type { PageToImageResult } from './PageToImageResult';
import type { ParseOptions } from './ParseOptions';
import { type MinMax, PathGeometry } from './PathGeometry';
import type { PageTableResult, TableResult } from './TableResult';
import { type TextResult, TextResultDefault } from './TextResult';

if (typeof (globalThis as any).pdfjs === 'undefined') {
	(globalThis as any).pdfjs = pdfjs;
}

export class PDFParse {
	private readonly options: ParseOptions;
	private doc: PDFDocumentProxy | undefined;

	constructor(options: ParseOptions) {
		if (typeof options.data === 'object' && 'buffer' in options.data) {
			options.data = new Uint8Array(options.data);
		}
		options.verbosity = pdfjs.VerbosityLevel.ERRORS;
		this.options = options;
	}

	public async GetText(): Promise<TextResult> {
		const result: TextResult = { ...TextResultDefault };

		const infoData = await this.load();
		Object.assign(result, infoData);

		if (this.doc === undefined) {
			throw new Error('PDF document not loaded');
		}

		for (let i: number = 1; i <= result.total; i++) {
			if (this.shouldParse(i, result.total)) {
				const pageProxy = await this.doc.getPage(i);
				const text = await this.getPageText(pageProxy);
				result.pages.push({
					text: text,
					num: i,
				});
				pageProxy.cleanup();
			}
		}

		await this.doc.destroy();
		this.doc = undefined;

		for (const page of result.pages) {
			result.text += `${page.text}\n\n`;
		}

		return result;
	}

	private async load(): Promise<InfoResult> {
		const opts = { ...this.options };

		if (this.options.data instanceof Uint8Array) {
			opts.data = new Uint8Array(this.options.data);
		}

		const loadingTask = pdfjs.getDocument(opts);

		this.doc = await loadingTask.promise;
		const data = await this.doc.getMetadata();

		return {
			total: this.doc.numPages,
			info: data.info,
			metadata: data.metadata,
		};
	}

	private shouldParse(currentPage: number, totalPage: number): boolean {
		let parseFlag = false;

		if (this.options.partial) {
			if (this.options.first && currentPage <= this.options.first) {
				parseFlag = true;
			}

			if (!parseFlag) {
				if (this.options.last && currentPage > totalPage - this.options.last) {
					parseFlag = true;
				}
			}
		} else {
			parseFlag = true;
		}

		return parseFlag;
	}

	private async getPageText(page: PDFPageProxy): Promise<string> {
		const textContent = await page.getTextContent({
			includeMarkedContent: false,
			disableNormalization: false,
		});

		const strBuf: Array<string> = [];

		for (const item of textContent.items) {
			if (!('str' in item)) continue;
			strBuf.push(item.str);
			if (item.hasEOL) {
				strBuf.push('\n');
			}
		}

		return strBuf.join('');
	}

	public async GetImage(): Promise<ImageResult> {
		const result: ImageResult = { ...ImageResultDefault };

		const infoData = await this.load();
		Object.assign(result, infoData);

		if (this.doc === undefined) {
			throw new Error('PDF document not loaded');
		}

		for (let i: number = 1; i <= result.total; i++) {
			if (this.shouldParse(i, result.total)) {
				const page = await this.doc.getPage(i);
				const ops = await page.getOperatorList();

				const pageImages: PageImages = { pageNumber: i, images: [] };
				result.pages.push(pageImages);

				for (let j = 0; j < ops.fnArray.length; j++) {
					if (ops.fnArray[j] === pdfjs.OPS.paintInlineImageXObject || ops.fnArray[j] === pdfjs.OPS.paintImageXObject) {
						const name = ops.argsArray[j][0];
						const isCommon = page.commonObjs.has(name);
						const imgPromise = isCommon ? this.resolveEmbeddedImage(page.commonObjs, name) : this.resolveEmbeddedImage(page.objs, name);

						const { width, height, kind, data } = await imgPromise;

						// biome-ignore lint/suspicious/noExplicitAny: <underlying library does not contain valid typedefs>
						const canvasFactory = (this.doc as any).canvasFactory;

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
						const buff = canvasAndContext.canvas.toBuffer('image/png');

						const base64 = buff.toString('base64');
						const dataUrl = `data:image/png;base64,${base64}`;

						pageImages.images.push({
							data: buff,
							dataUrl,
							fileName: name,
							height,
							width,
							kind,
						});
					}
				}
			}
		}

		await this.doc.destroy();
		this.doc = undefined;

		return result;
	}

	private convertToRGBA({ src, dest, width, height, kind }: { src: Uint8Array; dest: Uint32Array; width: number; height: number; kind: number }) {
		if (kind === pdfjs.ImageKind.RGB_24BPP) {
			for (let i = 0, j = 0; i < src.length; i += 3, j++) {
				const r = src[i];
				const g = src[i + 1];
				const b = src[i + 2];
				dest[j] = (255 << 24) | (b << 16) | (g << 8) | r;
			}
		} else if (kind === pdfjs.ImageKind.GRAYSCALE_1BPP) {
			// Her bit bir pikseli temsil eder (0: siyah, 1: beyaz)
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
		} else {
			throw new Error(`convertToRGBA: Unsupported image kind: ${kind}`);
		}
	}

	private resolveEmbeddedImage(pdfObjects: PDFObjects, name: string): Promise<{ width: number; height: number; kind: number; data: Uint8Array }> {
		return new Promise((resolve, reject) => {
			// biome-ignore lint/suspicious/noExplicitAny: <underlying library does not contain valid typedefs>
			(pdfObjects as any).get(name, (imgData: any) => {
				if (imgData) {
					const dataBuff = new Uint8Array(imgData.data);
					resolve({ width: imgData.width, height: imgData.height, kind: imgData.kind, data: dataBuff });
				} else {
					reject(new Error(`Image object ${name} not found`));
				}
			});
		});
	}

	public async PageToImage(): Promise<PageToImageResult> {
		const result: PageToImageResult = { pages: [], total: 0 } as PageToImageResult;

		//const base = new URL('../../node_modules/pdfjs-dist/', import.meta.url);
		//this.options.cMapUrl = new URL('cmaps/', base).href;
		//this.options.cMapPacked = true;
		//this.options.standardFontDataUrl = new URL('legacy/build/standard_fonts/', base).href;

		const infoData = await this.load();
		Object.assign(result, infoData);

		if (this.doc === undefined) {
			throw new Error('PDF document not loaded');
		}

		for (let i: number = 1; i <= result.total; i++) {
			if (this.shouldParse(i, result.total)) {
				//const pageToImages: PageToImage = { pageNumber: i };
				//result.pages.push(pageToImages);

				const page = await this.doc.getPage(i);

				// biome-ignore lint/suspicious/noExplicitAny: <underlying library does not contain valid typedefs>
				const canvasFactory = (this.doc as any).canvasFactory;
				const viewport = page.getViewport({ scale: 1.0 });
				const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
				const renderContext = {
					canvasContext: canvasAndContext.context,
					viewport,
					canvas: canvasAndContext.canvas,
				};

				const renderTask = page.render(renderContext);
				await renderTask.promise;
				// Convert the canvas to an image buffer.
				const data = canvasAndContext.canvas.toBuffer('image/png');
				const base64 = data.toString('base64');
				const dataUrl = `data:image/png;base64,${base64}`;

				result.pages.push({
					data,
					dataUrl,
					pageNumber: i,
				});

				page.cleanup();
			}
		}

		await this.doc.destroy();
		this.doc = undefined;

		return result;
	}

	public async GetTable(): Promise<TableResult> {
		const infoData = await this.load();
		const result: TableResult = { ...infoData, pages: [], mergedTables: [] };

		if (this.doc === undefined) {
			throw new Error('PDF document not loaded');
		}

		for (let i: number = 1; i <= result.total; i++) {
			if (this.shouldParse(i, result.total)) {
				const page = await this.doc.getPage(i);
				const viewport = page.getViewport({ scale: 1 });

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
		await this.doc.destroy();
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
					debugger;
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
				debugger;
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

	private async getPageGeometry(page: PDFPageProxy): Promise<LineStore> {
		const lineStore: LineStore = new LineStore();
		const opList = await page.getOperatorList();

		const viewport = page.getViewport({ scale: 1 });

		let transformMatrix = [1, 0, 0, 1, 0, 0];
		const transformStack: Array<Array<number>> = [];

		let current_x: number = 0;
		let current_y: number = 0;

		for (let j = 0; j < opList.fnArray.length; j++) {
			const fn = opList.fnArray[j];
			const args = opList.argsArray[j];

			if (fn === pdfjs.OPS.constructPath) {
				while (args[0].length) {
					const op = args[0].shift();

					const combinedMatrix = pdfjs.Util.transform(viewport.transform, transformMatrix);

					if (op === pdfjs.OPS.rectangle) {
						const x = args[1].shift();
						const y = args[1].shift();
						const width = args[1].shift();
						const height = args[1].shift();

						if (Math.min(width, height) <= 2) {
							// TODO remove
							debugger;
						}

						const rect = new Rectangle(new Point(x, y), width, height);
						rect.transform(combinedMatrix);
						//rect.transform(viewport.transform);

						lineStore.addRectangle(rect);
					} else if (op === pdfjs.OPS.moveTo) {
						current_x = args[1].shift();
						current_y = args[1].shift();
					} else if (op === pdfjs.OPS.lineTo) {
						const x = args[1].shift();
						const y = args[1].shift();

						//default trasform
						const from = new Point(current_x, current_y);
						const to = new Point(x, y);
						const line = new Line(from, to);
						line.transform(combinedMatrix);
						//line.transform(viewport.transform);

						// // viewport transform
						// const _from = viewport.convertToViewportPoint(line.from.x, line.from.y)
						// const _to = viewport.convertToViewportPoint(line.to.x, line.to.y)
						//
						// const transformedLine = new Line(new Point(_from[0], _from[1]), new Point(_to[0], _to[1]))
						lineStore.add(line);

						current_x = x;
						current_y = y;
					}
				}
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

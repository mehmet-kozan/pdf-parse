import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { PDFObjects } from 'pdfjs-dist/types/src/display/pdf_objects';
import { type ImageResult, ImageResultDefault, type PageImages } from './ImageResult';
import type { InfoResult } from './InfoResult';
import type { ParseOptions } from './ParseOptions';
import { type TextResult, TextResultDefault } from './TextResult';

export class PDFParse {
	private readonly options: ParseOptions;
	private doc: PDFDocumentProxy | undefined;

	constructor(options: ParseOptions) {
		if (typeof options.data === 'object' && 'buffer' in options.data) {
			options.data = new Uint8Array(options.data);
		}
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

		//const pageText: string = '';

		for (const item of textContent.items) {
			if (!('str' in item)) continue;
			strBuf.push(item.str);
			//pageText += item.str;
			if (item.hasEOL) {
				strBuf.push('\n');
			}

			//if (item.hasEOL) pageText += '\n'
		}

		// todo normalize text pdf_find_controller.js
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
						// optional: data URL
						const dataUrl = `data:image/png;base64,${base64}`;

						pageImages.images.push({
							data: buff,
							dataUrl,
							fileName: name,
							height,
							width,
							kind,
						});

						// https://www.npmjs.com/package/canvas#examples
						//const aa = canvas.toDataURL("image/jpeg")
						//fs.writeFileSync(`${i}-${j}.jpg`, buff);
						//console.log('ok');
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
}

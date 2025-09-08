import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { InfoResult } from './InfoResult';
import type { ParseOptions } from './ParseOptions';
import type { TextResult } from './TextResult';
import { TextResultDefault } from './TextResult';

export class PDFParse {
	private readonly options: ParseOptions;
	private doc: PDFDocumentProxy | undefined;

	constructor(options: ParseOptions) {
		if (options.data) {
			//options.data = options.data.buffer;
		}
		//options.disableWorker = true;
		this.options = options;
	}

	public async GetText(): Promise<TextResult> {
		const result: TextResult = TextResultDefault;

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

		for (const page of result.pages) {
			result.text += `${page.text}\n\n`;
		}

		return result;
	}

	private async load(): Promise<InfoResult> {
		const loadingTask = pdfjs.getDocument(this.options);
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
}

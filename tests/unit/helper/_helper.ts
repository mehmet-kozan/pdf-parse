/** biome-ignore-all lint/suspicious/noConsole: test file */
import { promises as fs } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CACHE: Map<string, Buffer> = new Map();

export type TableArray = Array<string[]>;

export abstract class PDFFile {
	filePath: string;
	fileName: string;
	textFile: string;
	imageFolder: string;
	abstract total: number;
	password?: string;
	pages?: Array<{
		num: number;
		texts: Array<string>;
		imgs?: Array<{ name: string; dataUrl?: string }>;
		tables?: TableArray[];
	}>;

	constructor(callerUrl: string) {
		const callerPath = fileURLToPath(callerUrl);
		const callerName = basename(callerPath);
		this.fileName = callerName.replace('.ts', '.pdf');
		this.filePath = join(__dirname, '../../../reports/pdf', this.fileName);
		this.imageFolder = `${this.fileName}_images`;
		this.textFile = `${this.fileName}.txt`;
	}

	public async getBuffer() {
		return await readFile(this.filePath);
	}

	public getFirstText(pageNumber: number): string {
		const texts = this.getTexts(pageNumber);

		if (texts && texts.length > 0) {
			return texts[0];
		}

		throw new Error('No text found in pages.');
	}

	public getTexts(pageNumber: number): Array<string> {
		if (this.pages) {
			for (const page of this.pages) {
				if (page.num === pageNumber) return page.texts;
			}
		}

		throw new Error(`Page number ${pageNumber} not found in texts.`);
	}
}

export async function getData(callerUrl: string): Promise<{ filePath: string; textFile: string; buffer: Buffer }> {
	let filePath = fileURLToPath(callerUrl);
	filePath = filePath.replace('.ts', '.pdf');

	const textFile = `${basename(filePath)}.txt`;

	const buffer = await readFile(filePath);
	return {
		filePath,
		textFile,
		buffer,
	};
}

export async function pdf_file(fileName: string): Promise<Uint8Array> {
	const cachedItem = CACHE.get(fileName);

	if (cachedItem) {
		console.log(`Loadind pdf files from cache!.. Cache Size: ${CACHE.size}`);
		return new Uint8Array(cachedItem);
	}

	const filePath = join(__dirname, fileName);

	const buffer = await fs.readFile(filePath);

	CACHE.set(fileName, buffer);

	return new Uint8Array(buffer);
}

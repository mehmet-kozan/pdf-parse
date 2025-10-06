import type { InfoResult, Metadata } from './InfoResult.js';

export interface PageTableResult {
	num: number;
	tables: Array<Array<string>>;
}

export class TableResult implements InfoResult {
	pages: Array<PageTableResult> = [];
	mergedTables: Array<Array<string>> = [];
	total: number = 0;
	info?: object | undefined;
	metadata?: Metadata | undefined;

	constructor(info: InfoResult) {
		Object.assign(this, info);
	}
}

export interface PageTableResult {
	num: number;
	tables: Array<Array<string>>;
}

export class TableResult {
	pages: Array<PageTableResult> = [];
	mergedTables: Array<Array<string>> = [];
	total: number = 0;

	constructor(total: number) {
		this.total = total;
	}
}

export type TableArray = Array<Array<string>>;

/**
 * @public
 * PageTableResult
 */
export interface PageTableResult {
	num: number;
	tables: TableArray[];
}

/**
 * @public
 * TableResult
 */
export class TableResult {
	pages: Array<PageTableResult> = [];
	mergedTables: TableArray[] = [];
	total: number = 0;

	constructor(total: number) {
		this.total = total;
	}
}

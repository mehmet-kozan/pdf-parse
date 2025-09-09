import type { InfoResult } from './InfoResult';

export interface TableResult extends InfoResult {
	pages: Array<PageTableResult>;
	mergedTables: Array<Array<string>>;
}

export interface PageTableResult {
	num: number;
	tables: Array<Array<string>>;
}

export const TableResultDefault: TableResult = {
	pages: [],
	total: 0,
	mergedTables: [],
	info: undefined,
	metadata: undefined,
};

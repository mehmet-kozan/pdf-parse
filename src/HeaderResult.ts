export interface HeaderResult {
	ok: boolean;
	status?: number;
	size?: number;
	isPdf?: boolean;
	headers?: Record<string, string>;
	error?: Error;
}

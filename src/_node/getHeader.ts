import * as http from 'node:http';
import * as https from 'node:https';

/**
 * Result information from getHeader.
 * @public
 */
export interface HeaderResult {
	ok: boolean;
	status?: number;
	size?: number;
	magic: boolean | null;
	headers?: Record<string, string>;
	error?: Error;
}

interface RequestResult {
	status: number;
	headers: Record<string, string>;
	buffer?: Buffer;
}

async function nodeRequest(u: URL, method: string, headers?: Record<string, string>): Promise<RequestResult> {
	return new Promise((resolve, reject) => {
		const reqFn = u.protocol === 'https:' ? https.request : http.request;
		const req = reqFn(u, { method, headers }, (res) => {
			const headersObj: Record<string, string> = {};
			for (const [k, v] of Object.entries(res.headers)) {
				headersObj[k] = Array.isArray(v) ? v.join(',') : (v ?? '');
			}

			const chunks: Buffer[] = [];
			res.on('data', (c) => chunks.push(Buffer.from(c)));
			res.on('end', () => {
				const buffer = chunks.length ? Buffer.concat(chunks) : undefined;
				resolve({ status: res.statusCode ?? 0, headers: headersObj, buffer });
			});
		});

		req.on('error', (err) => reject(err));
		req.end();
	});
}

/**
 * Perform an HTTP HEAD request to retrieve the file size and verify existence;
 * when `check` is true, fetch a small range and inspect the magic number to confirm the URL points to a valid PDF.
 * If the server does not support range requests, `isPdf` will be set to `false`.
 * @param url - The URL of the PDF file to check. Can be a string or URL object.
 * @param check - When `true`, download a small byte range (first 4 bytes) to validate the file signature by checking for '%PDF' magic bytes. Default: `false`.
 * @returns - A Promise that resolves to a HeaderResult object containing the response status, size, headers, and PDF validation result.
 * @public
 */
export async function getHeader(url: string | URL, check: boolean = false): Promise<HeaderResult> {
	try {
		const u = typeof url === 'string' ? new URL(url) : url;

		const headResp = await nodeRequest(u, 'HEAD');
		const size = headResp.headers['content-length'] ? parseInt(headResp.headers['content-length'], 10) : undefined;

		let magic: boolean | null = null;
		if (check) {
			const rangeResp = await nodeRequest(u, 'GET', { Range: 'bytes=0-4' });
			if (rangeResp.status >= 200 && rangeResp.status < 300 && rangeResp.buffer) {
				const headerStr = rangeResp.buffer.slice(0, 4).toString('utf8');
				magic = headerStr.startsWith('%PDF');
			} else {
				magic = false;
			}
		}

		return {
			ok: headResp.status >= 200 && headResp.status < 300,
			status: headResp.status,
			size,
			magic,
			headers: headResp.headers,
		};
	} catch (error) {
		return {
			ok: false,
			status: undefined,
			size: undefined,
			magic: false,
			headers: {},
			error: new Error(String(error)),
		};
	}
}

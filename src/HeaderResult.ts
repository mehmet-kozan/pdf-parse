export interface HeaderResult {
	ok: boolean;
	status?: number;
	size?: number;
	isPdf?: boolean;
	headers?: Record<string, string>;
	error?: Error;
}

/**
 * Perform an HTTP HEAD request to retrieve the file size and verify existence;
 * when `check` is true, fetch a small range and inspect the magic number to confirm the URL points to a valid PDF.
 * If the server does not support range requests, `isPdf` will be set to `false`.
 * @param url The URL of the PDF file to check. Can be a string or URL object.
 * @param check When `true`, download a small byte range (first 4 bytes) to validate the file signature by checking for '%PDF' magic bytes. Default: `false`.
 * @returns A Promise that resolves to a HeaderResult object containing the response status, size, headers, and PDF validation result.
 */
export async function getHeader(url: string | URL, check: boolean = false): Promise<HeaderResult> {
	try {
		// Try using global fetch when available (browser / Node 18+)
		// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
		const fetch: typeof globalThis.fetch = (globalThis as any).fetch;

		if (typeof fetch === 'function') {
			const headResp = await fetch(url, { method: 'HEAD' });
			const headersObj: Record<string, string> = {};
			headResp.headers.forEach((v: string, k: string) => {
				headersObj[k] = v;
			});

			const size = headResp.headers.get('content-length') ? parseInt(headResp.headers.get('content-length') as string, 10) : undefined;

			let isPdf: boolean | undefined;
			if (check) {
				// Try range request to fetch initial bytes
				const rangeResp = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-4' } });
				if (rangeResp.ok) {
					const buf = new Uint8Array(await rangeResp.arrayBuffer());
					const headerStr = Array.from(buf)
						.map((b) => String.fromCharCode(b))
						.join('');
					isPdf = headerStr.startsWith('%PDF');
				} else {
					isPdf = false;
				}
			}

			return { ok: headResp.ok, status: headResp.status, size, isPdf, headers: headersObj };
		}

		throw new Error('Fetch API not available');
	} catch (error) {
		return { ok: false, status: undefined, size: undefined, isPdf: false, headers: {}, error: new Error(String(error)) };
	}
}

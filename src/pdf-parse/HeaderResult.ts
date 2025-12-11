/**
 * Metadata returned from a HEAD/ranged probe against a PDF URL.
 *
 * @property ok - Overall success flag.
 * @property fileSize - Content length parsed from the `Content-Length` header (bytes), if provided.
 * @property validPdf - True when the optional range read confirms the `%PDF` magic header; false when the check fails; `undefined` when no check is performed.
 * @property status - HTTP status code returned by the server.
 * @property headers - Response headers normalized to lowercase keys.
 * @property error - Any error captured while probing.
 */
export interface HeaderResult {
	ok: boolean;
	fileSize?: number;
	validPdf?: boolean;
	status?: number;
	headers?: Record<string, string>;
	error?: Error;
}

/**
 * Perform an HTTP HEAD request to retrieve the file size and verify existence;
 * when `check` is true, fetch a small range and inspect the magic number to confirm the URL points to a valid PDF.

 * @param url - The URL of the PDF file to check. Can be a string or URL object.
 * @param check - When `true`, download a small byte range (first 4 bytes) to validate the file signature by checking for '%PDF' magic bytes. Default: `false`.
 * @returns - A Promise that resolves to a HeaderResult object containing the response status, size, headers, and PDF validation result.
 * @public
 */
export async function getHeaderRequest(url: string | URL, check: boolean): Promise<HeaderResult> {
	const result = {
		ok: false,
	} as HeaderResult;

	try {
		url = typeof url === 'string' ? new URL(url) : url;

		const method = check ? 'GET' : 'HEAD';
		const headers: HeadersInit = {};

		if (check) {
			headers.Range = 'bytes=0-4';
		}

		const response = await fetch(url, { method, headers });

		const clen = response.headers.get('content-length');
		result.fileSize = clen ? parseInt(clen, 10) : undefined;
		result.status = response.status;
		result.headers = Object.fromEntries(response.headers);

		if (!response.ok) {
			result.error = new Error(`invalid http status code ${response.status}`);
			return result;
		}

		if (check) {
			const reader = response.body?.getReader();
			if (!reader) return result;

			const { value } = await reader.read();
			reader.cancel();

			const crange = response.headers.get('content-range');
			if (crange?.includes('/')) {
				result.fileSize = parseInt(crange.split('/')[1], 10);
			}
			if (!value) return result;

			const bytes = value.subarray ? value.subarray(0, 4) : new Uint8Array(value.buffer ?? value);
			const headerStr = new TextDecoder().decode(bytes);

			result.validPdf = headerStr.startsWith('%PDF');
			result.ok = result.validPdf === true;
		} else if (result.fileSize && result.fileSize > 0) {
			result.ok = true;
		}
	} catch (error) {
		if (error instanceof Error) {
			result.error = error;
		} else {
			result.error = new Error(String(error));
		}
	}

	return result;
}

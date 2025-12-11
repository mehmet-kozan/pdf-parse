/* biome-ignore-all lint/suspicious/noExplicitAny: underline-type */

/**
 * Error thrown when the parsed data is not a valid PDF document.
 *
 * Use this exception to signal that the input cannot be interpreted as a PDF
 * (corrupt file, invalid header, etc.).
 *
 * @public
 */
export class InvalidPDFException extends Error {
	/**
	 * Create a new InvalidPDFException.
	 * @param message - Optional error message.
	 * @param cause - Optional underlying cause (preserved on modern runtimes).
	 */
	constructor(message?: string, cause?: unknown) {
		if (cause !== undefined) {
			// Use modern ErrorOptions to attach cause when supported
			super(message ?? 'Invalid PDF', { cause });
		} else {
			super(message ?? 'Invalid PDF');
		}
		this.name = 'InvalidPDFException';
		// Fix TS/ES prototype chain (required)
		Object.setPrototypeOf(this, InvalidPDFException.prototype);
		// preserve native stack trace where available
		if (typeof (Error as any).captureStackTrace === 'function') {
			(Error as any).captureStackTrace(this, InvalidPDFException);
		}
		// If you need to support older TS/targets that don't accept ErrorOptions,
		// replace the above super(...) with super(...); and uncomment:
		// if (cause !== undefined) (this as any).cause = cause;
	}
}

/**
 * Error indicating a PDF file requires a password or the provided password is incorrect.
 *
 * @public
 */
export class PasswordException extends Error {
	/**
	 * Create a new PasswordException.
	 * @param message - Optional error message.
	 * @param cause - Optional underlying cause.
	 */
	constructor(message?: string, cause?: unknown) {
		if (cause !== undefined) {
			super(message ?? 'Password required or incorrect', { cause });
		} else {
			super(message ?? 'Password required or incorrect');
		}
		this.name = 'PasswordException';
		Object.setPrototypeOf(this, PasswordException.prototype);
		if (typeof (Error as any).captureStackTrace === 'function') {
			(Error as any).captureStackTrace(this, PasswordException);
		}
		// Fallback for older targets: if needed use (this as any).cause = cause;
	}
}

/**
 * Error thrown when the PDF structure/contents are malformed and cannot be parsed.
 *
 * This is raised for low-level format problems detected while reading PDF objects.
 * Errors caused during parsing PDF data.
 *
 * @public
 */
export class FormatError extends Error {
	/**
	 * Create a new FormatError.
	 * @param message - Optional message describing the format problem.
	 * @param cause - Optional underlying cause.
	 */
	constructor(message?: string, cause?: unknown) {
		if (cause !== undefined) {
			super(message ?? 'PDF format error', { cause });
		} else {
			super(message ?? 'PDF format error');
		}
		this.name = 'FormatError';
		Object.setPrototypeOf(this, FormatError.prototype);
		if (typeof (Error as any).captureStackTrace === 'function') {
			(Error as any).captureStackTrace(this, FormatError);
		}
		// Fallback for older targets: if needed use (this as any).cause = cause;
	}
}

/**
 * Generic wrapper for errors where the library cannot classify the cause.
 *
 * The `details` property may contain additional information provided by the
 * underlying PDF library.
 *
 * @public
 */
export class UnknownErrorException extends Error {
	/**
	 * Create a new UnknownErrorException.
	 * @param message - Optional error message.
	 * @param details - Optional additional details from the PDF library.
	 * @param cause - Optional underlying cause.
	 */
	constructor(message?: string, details?: unknown, cause?: unknown) {
		if (cause !== undefined) {
			super(message ?? 'Unknown error', { cause });
		} else {
			super(message ?? 'Unknown error');
		}
		this.name = 'UnknownErrorException';
		Object.setPrototypeOf(this, UnknownErrorException.prototype);
		if (typeof (Error as any).captureStackTrace === 'function') {
			(Error as any).captureStackTrace(this, UnknownErrorException);
		}
		// additional info field from pdf.mjs
		(this as any).details = details;
	}
}

/**
 * Represents an HTTP/network response error encountered while fetching PDF data.
 *
 * The `status` and `missing` properties mirror values that may be provided
 * by the underlying PDF library's network layer.
 *
 * @public
 */
export class ResponseException extends Error {
	/**
	 * Create a new ResponseException.
	 * @param message - Optional error message.
	 * @param status - Optional numeric HTTP/status code.
	 * @param missing - Optional field describing missing resources.
	 * @param cause - Optional underlying cause.
	 */
	constructor(message?: string, status?: number, missing?: unknown, cause?: unknown) {
		if (cause !== undefined) {
			super(message ?? 'Response error', { cause });
		} else {
			super(message ?? 'Response error');
		}
		this.name = 'ResponseException';
		Object.setPrototypeOf(this, ResponseException.prototype);
		if (typeof (Error as any).captureStackTrace === 'function') {
			(Error as any).captureStackTrace(this, ResponseException);
		}
		// fields from pdf.mjs
		(this as any).status = status;
		(this as any).missing = missing;
	}
}

/**
 * Error used to indicate that an operation was aborted (for example by an AbortSignal).
 *
 * @public
 */
export class AbortException extends Error {
	/**
	 * Create a new AbortException.
	 * @param message - Optional error message.
	 * @param cause - Optional underlying cause.
	 */
	constructor(message?: string, cause?: unknown) {
		if (cause !== undefined) {
			super(message ?? 'Operation aborted', { cause });
		} else {
			super(message ?? 'Operation aborted');
		}
		this.name = 'AbortException';
		Object.setPrototypeOf(this, AbortException.prototype);
		if (typeof (Error as any).captureStackTrace === 'function') {
			(Error as any).captureStackTrace(this, AbortException);
		}
	}
}

/**
 * Normalize arbitrary thrown values into an Error instance used by the library.
 *
 * Known Error instances with specific names are mapped to the library's
 * typed exceptions in order to preserve type information and any additional
 * fields (for example `details`, `status`, etc.). If the value is not an
 * Error it is converted to a generic Error containing the stringified value.
 *
 * @public
 * @param error - The thrown value to normalize.
 * @returns An Error instance representing the provided value.
 */
export function getException(error: unknown): Error {
	if (error instanceof Error) {
		// preserve original error (stack) when not remapping
		switch (error.name) {
			case 'InvalidPDFException':
				return new InvalidPDFException(error.message, error);
			case 'PasswordException':
				return new PasswordException(error.message, error);
			case 'FormatError':
				return new FormatError(error.message, error);
			case 'UnknownErrorException':
				// preserve details if present on original
				return new UnknownErrorException(error.message, (error as any).details, error);
			case 'ResponseException':
				return new ResponseException(error.message, (error as any).status, (error as any).missing, error);
			case 'AbortException':
				return new AbortException(error.message, error);
			// add other mappings as needed
			default:
				return error;
		}
	}

	// non-Error value -> convert to Error
	return new Error(String(error));
}

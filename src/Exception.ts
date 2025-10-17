/** biome-ignore-all lint/suspicious/noExplicitAny: <underline type> */

export class InvalidPDFException extends Error {
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

export class PasswordException extends Error {
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

// Error caused during parsing PDF data.
export class FormatError extends Error {
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

export class UnknownErrorException extends Error {
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

export class ResponseException extends Error {
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

export class AbortException extends Error {
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

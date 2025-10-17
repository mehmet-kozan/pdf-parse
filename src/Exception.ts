/** biome-ignore-all lint/suspicious/noExplicitAny: <underline type> */

// export type {

// 	AbortException,
// 	FormatError,
// 	InvalidPDFException,
// 	PasswordException,
// 	ResponseException,
// 	UnknownErrorException,
// } from 'pdfjs-dist/types/src/shared/util.js';

//import * as util from 'pdfjs-dist/types/src/shared/util.js';

// export class A extends util.InvalidPDFException {
// 	constructor(aa: string) {
// 		super('');
// 	}
// }

// export class BaseException {
// 	message: string;
// 	name: string;

// 	constructor(message: string, name: string) {
// 		this.message = message;
// 		this.name = name;
// 	}
// }

// export class CustomException extends BaseException {
// 	public code: number;
// 	constructor(msg: string, code: number) {
// 		super(msg, 'CustomException');
// 		this.code = code;
// 	}
// }

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

// PasswordException
// UnknownErrorException
// InvalidPDFException
// ResponseException
// FormatError // Error caused during parsing PDF data.
// AbortException
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
			// add other mappings as needed
			default:
				return error;
		}
	}

	// non-Error value -> convert to Error
	return new Error(String(error));
}

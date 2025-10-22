/** biome-ignore-all lint/suspicious/noConsole: log utils */
import { VerbosityLevel } from './LoadParameters.js';

let verbosity = VerbosityLevel.WARNINGS;

export function getVerbosityLevel() {
	return verbosity;
}

export function setVerbosityLevel(level: VerbosityLevel) {
	if (Number.isInteger(level)) {
		verbosity = level;
	}
}

// A notice for devs.
export function logInfo(msg: string) {
	if (verbosity >= VerbosityLevel.INFOS) {
		console.info(`Info: ${msg}`);
	}
}

// Non-fatal warnings.
export function logWarn(msg: string) {
	if (verbosity >= VerbosityLevel.WARNINGS) {
		console.warn(`Warning: ${msg}`);
	}
}

// Fatal error.
export function logError(msg: string) {
	if (verbosity === VerbosityLevel.ERRORS) {
		console.error(`Error: ${msg}`);
	}
}

function sanitize_str(value: string) {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: remove UTF16 BOM and weird 0x0 char
	return value?.replaceAll(/(^þÿ|\u0000)/g, '');
}

export function sanitize(value: string | string[]) {
	if (value) {
		if (typeof value === 'string') {
			return sanitize_str(value);
		} else if (Array.isArray(value)) {
			if (value.length === 1) {
				return sanitize_str(value[0]);
			}

			const arrValue = [];
			for (let strVal of value) {
				strVal = sanitize_str(strVal);
				arrValue.push(strVal);
			}
			return arrValue;
		} else {
			logWarn(`sanitized value incompatiple type: ${value}`);
		}
	}

	return undefined;
}

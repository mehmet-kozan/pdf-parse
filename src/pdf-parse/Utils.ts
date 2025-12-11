/** biome-ignore-all lint/suspicious/noConsole: log utils */
import { VerbosityLevel } from './LoadParameters.js';

let verbosity = VerbosityLevel.WARNINGS;

// PDF 32000-1:2008 specification
const DATE_REGEX = new RegExp(
	'^D:' + // Prefix (required)
		'(\\d{4})' + // Year (required)
		'(\\d{2})?' + // Month (optional)
		'(\\d{2})?' + // Day (optional)
		'(\\d{2})?' + // Hour (optional)
		'(\\d{2})?' + // Minute (optional)
		'(\\d{2})?' + // Second (optional)
		'([Z|+|-])?' + // Universal time relation (optional)
		'(\\d{2})?' + // Offset hour (optional)
		"'?" + // Splitting apostrophe (optional)
		'(\\d{2})?' + // Offset minute (optional)
		"'?", // Trailing apostrophe (optional)
);

export function getVerbosityLevel() {
	return verbosity;
}

export function setVerbosityLevel(level: VerbosityLevel | undefined) {
	if (Number.isInteger(level)) {
		verbosity = level ?? VerbosityLevel.ERRORS;
	} else {
		verbosity = VerbosityLevel.ERRORS;
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

/**
 * Convert a PDF date string to a JavaScript `Date` object.
 *
 * The PDF date string format is described in section 7.9.4 of the official
 * PDF 32000-1:2008 specification. However, in the PDF 1.7 reference (sixth
 * edition) Adobe describes the same format including a trailing apostrophe.
 * This syntax in incorrect, but Adobe Acrobat creates PDF files that contain
 * them. We ignore all apostrophes as they are not necessary for date parsing.
 *
 * Moreover, Adobe Acrobat doesn't handle changing the date to universal time
 * and doesn't use the user's time zone (effectively ignoring the HH' and mm'
 * parts of the date string).
 */
export function toDateObject(input: Date | string): Date | null {
	if (input instanceof Date) {
		return input;
	}

	if (!input || typeof input !== 'string') {
		return null;
	}

	// Optional fields that don't satisfy the requirements from the regular
	// expression (such as incorrect digit counts or numbers that are out of
	// range) will fall back the defaults from the specification.
	const matches = DATE_REGEX.exec(input);
	if (!matches) {
		return null;
	}

	// JavaScript's `Date` object expects the month to be between 0 and 11
	// instead of 1 and 12, so we have to correct for that.
	const year = parseInt(matches[1], 10);
	let month = parseInt(matches[2], 10);
	month = month >= 1 && month <= 12 ? month - 1 : 0;
	let day = parseInt(matches[3], 10);
	day = day >= 1 && day <= 31 ? day : 1;
	let hour = parseInt(matches[4], 10);
	hour = hour >= 0 && hour <= 23 ? hour : 0;
	let minute = parseInt(matches[5], 10);
	minute = minute >= 0 && minute <= 59 ? minute : 0;
	let second = parseInt(matches[6], 10);
	second = second >= 0 && second <= 59 ? second : 0;
	const universalTimeRelation = matches[7] || 'Z';
	let offsetHour = parseInt(matches[8], 10);
	offsetHour = offsetHour >= 0 && offsetHour <= 23 ? offsetHour : 0;
	let offsetMinute = parseInt(matches[9], 10) || 0;
	offsetMinute = offsetMinute >= 0 && offsetMinute <= 59 ? offsetMinute : 0;

	// Universal time relation 'Z' means that the local time is equal to the
	// universal time, whereas the relations '+'/'-' indicate that the local
	// time is later respectively earlier than the universal time. Every date
	// is normalized to universal time.
	if (universalTimeRelation === '-') {
		hour += offsetHour;
		minute += offsetMinute;
	} else if (universalTimeRelation === '+') {
		hour -= offsetHour;
		minute -= offsetMinute;
	}

	return new Date(Date.UTC(year, month, day, hour, minute, second));
}

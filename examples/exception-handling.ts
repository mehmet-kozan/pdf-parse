import type { LoadParameters, ParseParameters, TextResult } from 'pdf-parse';
import { PasswordException, PDFParse, VerbosityLevel } from 'pdf-parse';

const loadParams: LoadParameters = {
	url: 'https://mehmet-kozan.github.io/pdf-parse/pdf/password-123456.pdf',
	verbosity: VerbosityLevel.WARNINGS,
	password: 'abcdef',
};

const parseParams: ParseParameters = {
	first: 1,
};

// Initialize the parser class without executing any code yet
const parser = new PDFParse(loadParams);

function handleResult(result: TextResult) {
	console.log(result.text);
}

try {
	const result = await parser.getText(parseParams);
	handleResult(result);
} catch (error) {
	// InvalidPDFException
	// PasswordException
	// FormatError
	// ResponseException
	// AbortException
	// UnknownErrorException
	if (error instanceof PasswordException) {
		console.error('Password must be 123456\n', error);
	} else {
		throw error;
	}
} finally {
	// Always call destroy() to free memory
	await parser.destroy();
}

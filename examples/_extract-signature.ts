import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function pdf_buffer(fileName: string): Promise<Uint8Array> {
	let filePath = join(__dirname, '../reports/pdf', fileName);

	if (!existsSync(filePath)) {
		filePath = join(__dirname, '../reports/pdf/signed', fileName);
	}

	const buffer = await readFile(filePath);

	return new Uint8Array(buffer);
}

function getSubstringIndex(str: string, substring: string, n: number) {
	let times = 0;
	let index = 0;

	while (times < n && index !== -1) {
		index = str.indexOf(substring, index + 1);
		times += 1;
	}

	return index;
}

async function getSignature(signatureCount: number = 1) {
	const buffer = await pdf_buffer('blank_signed.pdf');

	const pdf = Buffer.from(buffer).toString();

	//const pdf = buffer.toString('latin1');

	// const byteRangePos = pdf.indexOf('/ByteRange [');
	const byteRangePos = getSubstringIndex(pdf, '/ByteRange [', signatureCount);
	if (byteRangePos === -1) {
		debugger;
	}

	const byteRangeEnd = pdf.indexOf(']', byteRangePos);
	if (byteRangeEnd === -1) {
		debugger;
	}

	const byteRange = pdf.slice(byteRangePos, byteRangeEnd + 1).toString();
	const matches = /\/ByteRange \[(\d+) +(\d+) +(\d+) +(\d+) *\]/.exec(byteRange);
	if (matches === null) {
		return;
	}

	const ByteRange = matches.slice(1).map(Number);
	const signedData = Buffer.concat([
		buffer.slice(ByteRange[0], ByteRange[0] + ByteRange[1]),
		buffer.slice(ByteRange[2], ByteRange[2] + ByteRange[3]),
	]);

	const signatureHex = pdf
		.slice(ByteRange[0] + ByteRange[1] + 1, ByteRange[2])
		.toString()
		.replace(/(?:00|>)+$/, '');

	const signature = Buffer.from(signatureHex, 'hex').toString('binary');

	return {
		ByteRange: matches.slice(1, 5).map(Number),
		signature,
		signedData,
	};
}

await getSignature();

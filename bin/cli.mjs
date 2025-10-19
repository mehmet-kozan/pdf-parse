#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { stderr, stdout } from 'node:process';
import { PDFParse } from 'pdf-parse';
import { getHeader } from 'pdf-parse/node';

import minimist from './minimist.mjs';

const args = minimist(process.argv.slice(2), {
	alias: {
		h: 'help',
		v: 'version',
		o: 'output',
		p: 'pages',
		f: 'format',
		m: 'min',
		s: 'scale',
		w: 'width',
		l: 'large',
	},
	string: ['output', 'pages', 'format', 'min', 'scale', 'width'],
	boolean: ['help', 'version', 'magic', 'large'],
});

if (args.version) {
	const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
	stdout.write(`${pkg.name} ${pkg.version}\n`);
	process.exit(0);
}

if (args.help || args._.length === 0) {
	showHelp();
	process.exit(0);
}

const command = args._[0];
const filePath = args._[1];

if (!filePath) {
	stderr.write('Error: PDF file path or URL is required\n');
	stderr.write('Use --help for usage information\n');
	process.exit(1);
}

const commands = ['info', 'text', 'image', 'screenshot', 'ss', 'table', 'check'];

if (!commands.includes(command)) {
	stderr.write(`Error: Unknown command '${command}'\n`);
	stderr.write(`Available commands: ${commands.join(', ')}\n`);
	process.exit(1);
}

try {
	await runCommand(command, filePath, args);
} catch (error) {
	stderr.write(`Error: ${error.message}\n`);
	process.exit(1);
}

function showHelp() {
	const help = `Usage: pdf-parse <command> <file> [options]

Commands:
  check       Check PDF file headers and validate format (URL only)
  info        Extract PDF metadata and information
  text        Extract text content from PDF
  image       Extract embedded images from PDF
  screenshot  Generate screenshots of PDF pages (alias: ss)
  table       Extract tabular data from PDF

Options:
  -o, --output <file>          Output file path (for single file) or directory (for multiple files)
  -p, --pages <range>          Page range (e.g., 1,3-5,7)
  -f, --format <format>        Output format (json, text, dataurl)
  -m, --min <px>               Minimum image size threshold in pixels (default: 80)
  -s, --scale <factor>         Scale factor for screenshots (default: 1.0)
  -w, --width <px>             Desired width for screenshots in pixels
  -l, --large                  Enable optimizations for large PDF files
  --magic                      Validate PDF magic bytes (default: true)
  -h, --help                   Show this help message
  -v, --version                Show version number

Examples:
  pdf-parse info document.pdf
  pdf-parse text document.pdf --pages 1-3
  pdf-parse screenshot document.pdf --output screenshot.png
  pdf-parse table document.pdf --format json
  pdf-parse image document.pdf --output ./images/
  pdf-parse screenshot document.pdf --output ./screenshots/ --scale 2.0
  pdf-parse check https://bitcoin.org/bitcoin.pdf --magic
  pdf-parse text https://example.com/large.pdf --large --pages 1-5
`;
	stdout.write(help);
}

async function runCommand(command, filePath, options) {
	let initParams;

	if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
		initParams = { url: filePath };
	} else {
		const data = await readFile(filePath);
		initParams = { data };
	}

	// Apply large file optimizations if --large flag is used
	if (options.large) {
		initParams.disableAutoFetch = true;
		initParams.disableStream = true;
		initParams.rangeChunkSize = 65536;
	}

	const parser = new PDFParse(initParams);

	try {
		switch (command) {
			case 'check':
				await handleGetHeader(filePath, options);
				break;
			case 'info':
				await handleGetInfo(parser, options);
				break;
			case 'text':
				await handleGetText(parser, options);
				break;
			case 'image':
				await handleGetImage(parser, options);
				break;
			case 'screenshot':
			case 'ss':
				await handleGetScreenshot(parser, options);
				break;
			case 'table':
				await handleGetTable(parser, options);
				break;
		}
	} finally {
		await parser.destroy();
	}
}

async function handleGetHeader(filePath, options) {
	// Check if it's a URL
	if (!filePath.startsWith('http://') && !filePath.startsWith('https://')) {
		stderr.write('Error: check command only works with URLs, not local files\n');
		stderr.write('Use: pdf-parse check https://bitcoin.org/bitcoin.pdf\n');
		process.exit(1);
	}

	// Second parameter is for PDF magic bytes validation
	const result = await getHeader(filePath, !!options.magic);
	const output = options.format === 'json' ? JSON.stringify(result, null, 2) : formatHeader(result);

	if (options.output) {
		await writeFile(options.output, output);
	} else {
		stdout.write(output);
	}
}

async function handleGetInfo(parser, options) {
	const result = await parser.getInfo();
	const output = options.format === 'json' ? JSON.stringify(result, null, 2) : formatInfo(result);

	if (options.output) {
		await writeFile(options.output, output);
	} else {
		stdout.write(output);
	}
}

async function handleGetText(parser, options) {
	const params = parsePageParams(options);
	const result = await parser.getText(params);
	const output = options.format === 'json' ? JSON.stringify(result, null, 2) : result.text;

	if (options.output) {
		await writeFile(options.output, output);
	} else {
		stdout.write(output);
	}
}

async function handleGetImage(parser, options) {
	const params = parsePageParams(options);
	params.imageBuffer = true;
	params.imageDataUrl = options.format === 'dataurl';

	if (options.min) {
		params.imageThreshold = parseInt(options.min, 10);
	}

	const result = await parser.getImage(params);

	if (options.output) {
		// Create output directory if it doesn't exist
		const outputDir = options.output;
		await createDirectoryIfNeeded(outputDir);

		let imageCount = 0;
		for (const page of result.pages) {
			for (const image of page.images) {
				const ext = 'png';
				const filename = `page_${page.pageNumber}_image_${imageCount}.${ext}`;
				const filepath = `${outputDir}/${filename}`;

				await writeFile(filepath, image.data);
				imageCount++;
			}
		}

		stdout.write(`Extracted ${imageCount} images to ${outputDir}\n`);
	} else {
		// List images without extracting
		let totalImages = 0;
		for (const page of result.pages) {
			totalImages += page.images.length;
		}

		if (options.format === 'json') {
			// Remove binary data for JSON output
			const cleanResult = {
				total: result.total,
				pages: result.pages.map((page) => ({
					pageNumber: page.pageNumber,
					imageCount: page.images.length,
					images: page.images.map((img) => ({
						name: img.name,
						width: img.width,
						height: img.height,
						kind: img.kind,
					})),
				})),
			};
			stdout.write(JSON.stringify(cleanResult, null, 2));
		} else {
			stdout.write(`Found ${totalImages} images across ${result.total} pages\n`);
			for (const page of result.pages) {
				if (page.images.length > 0) {
					stdout.write(`Page ${page.pageNumber}: ${page.images.length} images\n`);
					for (let i = 0; i < page.images.length; i++) {
						const img = page.images[i];
						stdout.write(`  Image ${i}: ${img.width}x${img.height} (${img.name})\n`);
					}
				}
			}
		}
	}
}

async function handleGetScreenshot(parser, options) {
	const params = parsePageParams(options);
	params.imageBuffer = true;
	params.imageDataUrl = options.format === 'dataurl';

	if (options.scale) {
		params.scale = parseFloat(options.scale);
	}

	if (options.width) {
		params.desiredWidth = parseInt(options.width, 10);
	}

	const result = await parser.getScreenshot(params);

	if (options.output) {
		// Create output directory if it doesn't exist
		const outputDir = options.output;
		await createDirectoryIfNeeded(outputDir);

		let screenshotCount = 0;
		for (const page of result.pages) {
			const ext = 'png';
			const filename = `page_${page.pageNumber}_screenshot.${ext}`;
			const filepath = `${outputDir}/${filename}`;

			await writeFile(filepath, page.data);
			screenshotCount++;
		}

		stdout.write(`Generated ${screenshotCount} screenshots to ${outputDir}\n`);
	} else {
		// List screenshots without generating
		if (options.format === 'json') {
			// Remove binary data for JSON output
			const cleanResult = {
				total: result.total,
				pages: result.pages.map((page) => ({
					pageNumber: page.pageNumber,
					width: page.width,
					height: page.height,
					scale: page.scale,
				})),
			};
			stdout.write(JSON.stringify(cleanResult, null, 2));
		} else {
			stdout.write(`Would generate ${result.pages.length} screenshots across ${result.total} pages\n`);
			for (const page of result.pages) {
				stdout.write(`Page ${page.pageNumber}: ${page.width}x${page.height} (scale: ${page.scale})\n`);
			}
		}
	}
}

async function handleGetTable(parser, options) {
	const params = parsePageParams(options);
	const result = await parser.getTable(params);

	if (options.format === 'json') {
		stdout.write(JSON.stringify(result, null, 2));
	} else {
		// Text format - pretty print tables
		let output = `Found tables across ${result.total} pages:\n\n`;

		for (const page of result.pages) {
			if (page.tables.length > 0) {
				output += `Page ${page.num}:\n`;
				for (let i = 0; i < page.tables.length; i++) {
					output += `Table ${i + 1}:\n`;
					const table = page.tables[i];

					// Calculate column widths
					const colWidths = [];
					for (let col = 0; col < table[0].length; col++) {
						let maxWidth = 0;
						for (const row of table) {
							if (row[col]) {
								maxWidth = Math.max(maxWidth, row[col].length);
							}
						}
						colWidths[col] = maxWidth;
					}

					// Print table
					for (const row of table) {
						for (let col = 0; col < row.length; col++) {
							const cell = row[col] || '';
							const width = colWidths[col] || 10;
							output += cell.padEnd(width + 2);
						}
						output += '\n';
					}
					output += '\n';
				}
			}
		}

		stdout.write(output);
	}
}

function parsePageParams(options) {
	const params = {};

	if (options.pages) {
		// Parse page range like "1,3-5,7" into partial array
		const partial = [];
		const ranges = options.pages.split(',');

		for (const range of ranges) {
			if (range.includes('-')) {
				const [start, end] = range.split('-').map((n) => parseInt(n.trim(), 10));
				for (let i = start; i <= end; i++) {
					partial.push(i);
				}
			} else {
				partial.push(parseInt(range.trim(), 10));
			}
		}

		params.partial = partial;
	}

	return params;
}

function formatInfo(result) {
	let output = `Total pages: ${result.total}\n`;

	if (result.info) {
		output += `\nDocument Info:\n`;
		for (const [key, value] of Object.entries(result.info)) {
			output += `  ${key}: ${value}\n`;
		}
	}

	if (result.metadata) {
		output += `\nMetadata:\n`;
		for (const [key, value] of Object.entries(result.metadata)) {
			output += `  ${key}: ${value}\n`;
		}
	}

	return output;
}

function formatHeader(result) {
	const magic = result.magic === null ? '-' : !!result.magic;
	let output = `Status: ${result.status}\n`;
	output += `Size: ${result.size} bytes\n`;
	output += `Magic: ${magic}\n`;

	if (result.headers) {
		output += `\nHeaders:\n`;
		for (const [key, value] of Object.entries(result.headers)) {
			output += `  ${key}: ${value}\n`;
		}
	}

	return output;
}

async function createDirectoryIfNeeded(dirPath) {
	try {
		await mkdir(dirPath, { recursive: true });
	} catch (error) {
		if (error.code !== 'EEXIST') {
			throw error;
		}
	}
}

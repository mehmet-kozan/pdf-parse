/** biome-ignore-all lint/suspicious/noConsole: <example code> */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from '../dist/esm/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const file = join(__dirname, 'test.pdf');
const data = await readFile(file);

const parser = new PDFParse({ data });
const textResult = await parser.getText();

console.log(textResult.text);

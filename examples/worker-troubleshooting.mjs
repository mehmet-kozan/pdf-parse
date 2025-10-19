import { CanvasFactory, getData, getPath } from 'pdf-parse/worker';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __pdf = join(dirname(__filename), '../reports/pdf/image-test.pdf');

const buffer = readFileSync(__pdf);
let parser = new PDFParse({ data: buffer, CanvasFactory });
let textResult = await parser.getText();
let screenshotResult = await parser.getScreenshot();
let imageResult = await parser.getImage();

assert.ok(textResult.text.includes('Text-01'), 'text');
assert.ok(screenshotResult.pages[0].dataUrl.length > 100, 'screenshot');
assert.ok(imageResult.pages[0].images[0].dataUrl.length > 100, 'image');

console.log(textResult.text.includes('Text-01'));
console.log(screenshotResult.pages[0].dataUrl.length);
console.log(imageResult.pages[0].images[0].dataUrl.length);

// new parser
parser = new PDFParse({ data: buffer, CanvasFactory });
const path = getPath();
const data = getData();
PDFParse.setWorker(data);
PDFParse.setWorker(path);
textResult = await parser.getText();
screenshotResult = await parser.getScreenshot();
imageResult = await parser.getImage();

assert.ok(textResult.text.includes('Text-01'), 'text');
assert.ok(screenshotResult.pages[0].dataUrl.length > 100, 'screenshot');
assert.ok(imageResult.pages[0].images[0].dataUrl.length > 100, 'image');

console.log(textResult.text.includes('Text-01'));
console.log(screenshotResult.pages[0].dataUrl.length);
console.log(imageResult.pages[0].images[0].dataUrl.length);

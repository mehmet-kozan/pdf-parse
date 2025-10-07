import {PDFParse} from '../dist/esm/index.js'
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {readFile} from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const file = join(__dirname,'../data/test.pdf');
const data = await readFile(file);


const parser = new PDFParse({data});
const textResult = await parser.getText();

console.log(textResult.text);
/** biome-ignore-all lint/suspicious/noConsole: <test file> */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import{PDFParse, type PageTextResult} from 'pdf-parse-test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __pdf_files = join(__dirname, '../../../test/pdf_file/full-test.pdf');

const dataBuffer = await readFile(__pdf_files);

const parser = new PDFParse({ data: dataBuffer });




function test(res:PageTextResult){


  if(res.text.includes('Trace-based Just-in-Time Type Specialization') && res.num === 1){
    process.exit(0);
  }
  else{
    process.exit(1);
  }

}

const result = await parser.getText();
test(result.pages[0]);



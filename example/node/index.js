import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Import ESM entry from package root (package.json -> exports)
import pdfParse from '../../dist/esm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    const filePath = path.join(__dirname, '..', '..', 'test', 'test-01', 'test.pdf');
    const data = await fs.readFile(filePath);

    const result = await pdfParse(data);

    console.log('--- PDF text length ---');
    console.log(result?.text?.length ?? 0);
    console.log('--- First 300 characters of text ---');
    console.log((result?.text ?? '').slice(0, 300));
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

await main();
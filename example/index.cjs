const fs = require('fs');
const path = require('path');

// Resolve project root by going up two levels
// package.json "exports" will point to dist/cjs/index.js
const pdfParse = require('../dist/esm');

(async () => {
  try {
    const filePath = path.join(__dirname, '..', '..', 'test', 'test-01', 'test.pdf');
    const dataBuffer = fs.readFileSync(filePath);

    // Assume pdfParse returns a Promise (consistent with tests)
    const result = await pdfParse(dataBuffer);

    console.log('--- PDF text length ---');
    console.log(result?.text?.length ?? 0);
    console.log('--- First 300 characters of text ---');
    console.log((result?.text ?? '').slice(0, 300));
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
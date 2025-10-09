/** biome-ignore-all lint/suspicious/noConsole: <example code> */
const pdf = require('../dist/cjs/index.cjs');
const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'test.pdf');
const data = fs.readFileSync(file);

pdf(data).then((result) => {
	console.log(result.text);
});

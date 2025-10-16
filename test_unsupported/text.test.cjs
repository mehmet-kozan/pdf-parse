const { PDFParse } = require('pdf-parse');
const { describe, it } = require('node:test');
const assert = require('node:assert');

const { getWorkerPath } = require('pdf-parse/worker');

console.log(getWorkerPath());

function add(a, b) {
	return a + b;
}

describe('Toplama fonksiyonu', () => {
	it('1 + 2 = 3 olmalı', () => {
		assert.strictEqual(add(1, 2), 3);
	});

	it('negatif sayılarla çalışmalı', () => {
		assert.strictEqual(add(-1, 1), 0);
	});
});

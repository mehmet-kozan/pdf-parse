import { getWorkerPath } from 'pdf-parse/worker';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { PDFParse } from 'pdf-parse';

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

import { strict as assert } from 'node:assert';
import { exec } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execAsync = promisify(exec);

const cli = resolve(__dirname, 'cli.mjs');

test('prints help message and exits with 0', async () => {
	const { stdout, stderr, error } = await execAsync(`node ${cli} --help`);

	assert.ifError(error);
	assert.strictEqual(stderr, '');
	assert.match(stdout, /Usage: pdf-parse <command> <file> \[options\]/);
	assert.match(stdout, /Commands:/);
	assert.match(stdout, /check/);
	assert.match(stdout, /info/);
	assert.match(stdout, /text/);
	assert.match(stdout, /image/);
	assert.match(stdout, /screenshot/);
	assert.match(stdout, /table/);
});

test('prints version and exits with 0', async () => {
	const { stdout, stderr, error } = await execAsync(`node ${cli} --version`);

	assert.ifError(error);
	assert.strictEqual(stderr, '');
	assert.match(stdout, /\d+\.\d+\.\d+/); // Version format like 1.0.0
});

test('exits with 1 on missing file argument', async () => {
	await assert.rejects(execAsync(`node ${cli} info`), (err) => {
		assert.match(err.stderr, /Error: PDF file path or URL is required/);
		assert.strictEqual(err.code, 1);
		return true;
	});
});

test('exits with 1 on unknown command', async () => {
	await assert.rejects(execAsync(`node ${cli} invalid test.pdf`), (err) => {
		assert.match(err.stderr, /Error: Unknown command 'invalid'/);
		assert.match(err.stderr, /Available commands:/);
		assert.strictEqual(err.code, 1);
		return true;
	});
});

test('exits with 1 when check command used with local file', async () => {
	// Create a dummy file for testing
	const fs = await import('node:fs/promises');
	const dummyFile = resolve(__dirname, 'dummy.pdf');
	await fs.writeFile(dummyFile, 'dummy content');

	try {
		await assert.rejects(execAsync(`node ${cli} check ${dummyFile}`), (err) => {
			assert.match(err.stderr, /Error: check command only works with URLs/);
			assert.strictEqual(err.code, 1);
			return true;
		});
	} finally {
		// Clean up
		await fs.unlink(dummyFile).catch(() => {});
	}
});

test('recognizes all valid commands', async () => {
	const commands = ['check', 'info', 'text', 'image', 'screenshot', 'ss', 'table'];

	for (const cmd of commands) {
		await assert.rejects(execAsync(`node ${cli} ${cmd}`), (err) => {
			// Should fail due to missing file, not unknown command
			assert.match(err.stderr, /PDF file path or URL is required/);
			assert.strictEqual(err.code, 1);
			return true;
		});
	}
});

test('parses options correctly', async () => {
	// Create a dummy file for testing
	const fs = await import('node:fs/promises');
	const dummyFile = resolve(__dirname, 'dummy.pdf');
	await fs.writeFile(dummyFile, 'dummy content');

	try {
		await assert.rejects(
			execAsync(`node ${cli} info ${dummyFile} --format json --pages 1-3 --output result.json`),
			(err) => {
				// Should fail due to invalid PDF content, not option parsing error
				assert.match(err.stderr, /Error:/);
				assert.strictEqual(err.code, 1);
				return true;
			},
		);
	} finally {
		// Clean up
		await fs.unlink(dummyFile).catch(() => {});
	}
});

test('screenshot command accepts ss alias', async () => {
	await assert.rejects(execAsync(`node ${cli} ss`), (err) => {
		assert.match(err.stderr, /PDF file path or URL is required/);
		assert.strictEqual(err.code, 1);
		return true;
	});
});

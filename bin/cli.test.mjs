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
	const { stdout, stderr, error } = await execAsync(`node ${cli} test.pdf --help -h`);

	assert.ifError(error);
	assert.strictEqual(stderr, '');
	assert.match(stdout, /Usage: my-cli --help/);
});

test('exits with 1 on unknown command', async () => {
	await assert.rejects(execAsync(`node ${cli} invalid`), (err) => {
		assert.strictEqual(err.stderr, 'Unknown command\n');
		assert.strictEqual(err.code, 1);
		return true;
	});
});

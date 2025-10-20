#!/usr/bin/env node

/** biome-ignore-all lint/suspicious/noConsole: <test script> */
// This script recursively finds all subdirectories under test_integration/ containing a package.json file
// and runs npm install, npm run build, and npm test in each, using for-of instead of forEach.
import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const testDir = path.resolve(__dirname, '../examples');

async function findExampleScripts(dir) {
	const result = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		if (entry.name.startsWith('_')) continue;
		if (entry.name.endsWith('.html')) continue;
		//if (entry.name.endsWith('.ts')) continue;

		result.push(`examples/${entry.name}`);
	}
	return result;
}

function runCommand(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, { rootDir }, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error running ${cmd} :\n`, stderr);
				reject(error);
			} else {
				//console.log(`Output of ${cmd} in ${cwd}:`, stdout);
				resolve(stdout);
			}
		});
	});
}

async function main() {
	const scriptArr = await findExampleScripts(testDir);
	console.log('\n');
	for (const script of scriptArr) {
		console.log(`Processing: ${script}`);
		try {
			if (script.endsWith('.ts')) {
				await runCommand(`tsx ${script}`);
			} else {
				await runCommand(`node ${script}`);
			}
		} catch (err) {
			console.error(`Failed in ${script}:\n`, err);
			throw err;
		}
	}
}

main()
	.then(() => {
		console.log('\nExample Tests Succeeded!..\n');
		process.exit(0);
	})
	.catch((err) => {
		console.error('\nExample Tests Failed!..\n', err);
		process.exit(1);
	});

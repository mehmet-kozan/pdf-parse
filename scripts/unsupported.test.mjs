#!/usr/bin/env node

/** biome-ignore-all lint/suspicious/noConsole: <test script> */
import { exec } from 'node:child_process';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testDir = path.resolve(__dirname, '../tests/unsupported');



function runCommand(cmd, cwd) {
	return new Promise((resolve, reject) => {
		exec(cmd, { cwd }, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error running ${cmd} in ${cwd}:`, stderr);
				reject(error);
			} else {
				//console.log(`Output of ${cmd} in ${cwd}:`, stdout);
				resolve(stdout);
			}
		});
	});
}



async function main() {

	console.log(`Processing: ${testDir}`);
	try {
		await runCommand('npm install', testDir);
		await runCommand('npm test', testDir);
	} catch (err) {
		console.error(`Failed in ${testDir}:`, err);
		throw err;
	}
    
}

main()
	.then(() => {
		console.log('\nUnsupported Tests Succeeded!..\n');
		process.exit(0);
	})
	.catch((err) => {
		console.error('\nUnsupported Tests Failed!..\n', err);
		process.exit(1);
	});

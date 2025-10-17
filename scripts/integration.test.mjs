/** biome-ignore-all lint/suspicious/noConsole: <test script> */
// This script recursively finds all subdirectories under test_integration/ containing a package.json file
// and runs npm install, npm run build, and npm test in each, using for-of instead of forEach.
import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = path.resolve(__dirname, '../tests/integration');

async function packageExists(dir) {
	try {
		await fs.access(path.join(dir, 'package.json'));
		return true;
	} catch {
		return false;
	}
}

async function findPackageDirs(dir) {
	const result = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		const isPackage = await packageExists(fullPath);
		if (entry.isDirectory() && isPackage) {
			result.push(fullPath);
		}
	}
	return result;
}

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
	const packageDirs = await findPackageDirs(rootDir);
	for (const dir of packageDirs) {
		console.log(`\nProcessing: ${dir}`);
		try {
			await runCommand('npm install', dir);
			await runCommand('npm run build', dir);
			await runCommand('npm test', dir);
		} catch (err) {
			console.error(`Failed in ${dir}:`, err);
			throw err;
		}
	}
}

main()
	.then(() => {
		console.log('\nIntegration Tests Succeeded!..\n');
		process.exit(0);
	})
	.catch((err) => {
		console.error('\nIntegration Tests Failed!..\n', err);
		process.exit(1);
	});

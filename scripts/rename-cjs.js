/** biome-ignore-all lint/suspicious/noConsole: <script file> */
import { readdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

async function processDir(dir) {
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			await processDir(fullPath);
			continue;
		}

		const ext = extname(entry.name);
		const base = basename(entry.name, ext);

		// Rename .js -> .cjs and update imports
		if (ext === '.js' && !entry.name.endsWith('.cjs')) {
			const newPath = join(dir, `${base}.cjs`);

			// If target exists on Windows, remove it first
			try {
				await unlink(newPath);
			} catch {
				/* ignore if not exists */
			}

			// Rename file then update content in place
			await rename(fullPath, newPath);

			let content = await readFile(newPath, 'utf-8');

			content = content.replace(/require\(['"](.+?)\.js['"]\)/g, (m, p1) => {
				if (p1.startsWith('pdfjs-dist')) return m;
				return `require('${p1}.cjs')`;
			});
			content = content.replace(/from\s+['"](.+?)\.js['"]/g, (m, p1) => {
				if (p1.startsWith('pdfjs-dist')) return m;
				return `from '${p1}.cjs'`;
			});
			content = content.replace(/import\(['"](.+?)\.js['"]\)/g, (m, p1) => {
				if (p1.startsWith('pdfjs-dist')) return m;
				return `import('${p1}.cjs')`;
			});
			// match commented sourceMappingURL forms like '//# sourceMappingURL=foo.js.map' or '//@ sourceMappingURL=...'
			content = content.replace(/\/\/[#@]\s*sourceMappingURL=(.+?)\.js\.map/g, (m, p1) => {
				if (p1.startsWith('pdfjs-dist')) return m;
				return `//# sourceMappingURL=${p1}.cjs.map`;
			});
			// fallback general match
			content = content.replace(/sourceMappingURL=(.+?)\.js\.map/g, (m, p1) => {
				if (p1.startsWith('pdfjs-dist')) return m;
				return `sourceMappingURL=${p1}.cjs.map`;
			});

			await writeFile(newPath, content, 'utf-8');
			//console.log(`Renamed & Updated: ${entry.name} -> ${base}.cjs`);
		}

		// Update .d.ts files
		if (entry.name.endsWith('.d.ts')) {
			let content = await readFile(fullPath, 'utf-8');
			content = content.replace(/from\s+['"](.+?)\.js['"]/g, (m, p1) => {
				if (p1.startsWith('pdfjs-dist')) return m;
				return `from '${p1}.cjs'`;
			});
			content = content.replace(/import\(['"](.+?)\.js['"]\)/g, (m, p1) => {
				if (p1.startsWith('pdfjs-dist')) return m;
				return `import('${p1}.cjs')`;
			});
			await writeFile(fullPath, content, 'utf-8');
			//console.log(`Updated: ${entry.name}`);
		}

		// Update .js.map files -> .cjs.map
		if (entry.name.endsWith('.js.map')) {
			const newPath = join(dir, entry.name.replace('.js.map', '.cjs.map'));
			// if target exists remove it first (Windows)
			try {
				await unlink(newPath);
			} catch {
				/* ignore */
			}

			await rename(fullPath, newPath);

			const content = await readFile(newPath, 'utf-8');
			const mapData = JSON.parse(content);
			if (mapData.file && !mapData.file.startsWith('pdfjs-dist')) mapData.file = mapData.file.replace(/\.js$/, '.cjs');
			await writeFile(newPath, JSON.stringify(mapData, null, 2), 'utf-8');
			//console.log(`Renamed & Updated: ${entry.name} -> ${basename(newPath)}`);
		}
	}

	console.log('Rename scripts complated.');
}

processDir(join('.', 'dist', 'cjs')).catch(console.error);

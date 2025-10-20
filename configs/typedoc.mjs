/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
	entryPoints: ['../src/pdf-parse/index.ts'],
	projectDocuments: ['../docs/options.md', '../docs/command-line.md'],
	outputs: [
		{
			name: 'html',
			path: '../reports/typedoc',
			options: {
				cleanOutputDir: true,
				navigation: {
					includeCategories: true,
					includeGroups: true,
					excludeReferences: false,
					includeFolders: true,
				},
			},
		},
	],
};

export default config;

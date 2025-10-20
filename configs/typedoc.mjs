/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
	entryPoints: ['../src/pdf-parse/index.ts'],
	projectDocuments: ['../docs/options.md', '../docs/command-line.md', '../docs/troubleshooting.md'],
	outputs: [
		{
			name: 'html',
			path: '../reports/typedoc',
			options: {
				githubPages: 'https://mehmet-kozan.github.io/pdf-parse/',
				gitRemote: 'https://github.com/mehmet-kozan/pdf-parse/tree/main',
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

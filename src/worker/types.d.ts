/**
 * Ambient declaration for the pdfjs worker module that ships as an .mjs file
 * This prevents TS7016 errors when importing the runtime worker file.
 */
declare module 'pdfjs-dist/legacy/build/pdf.worker.mjs' {
	// biome-ignore lint/suspicious/noExplicitAny: underline module has no types
	const _default: any;
	export default _default;
}

declare module '*?url' {
	const src: string;
	export default src;
}

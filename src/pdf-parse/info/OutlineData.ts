/**
 * @public
 * Node representing a single item in the PDF outline (bookmarks).
 * This mirrors the structure returned by PDF.js' getOutline() API.
 */
export interface OutlineData {
	// The visible title of the bookmark / outline entry.
	title: string;

	// If true, the title should be rendered in bold.
	bold: boolean;

	// If true, the title should be rendered in italic.
	italic: boolean;

	// Optional RGBA color for the title as a clamped byte array.
	color: Uint8ClampedArray;

	// Destination for the outline item. PDF.js may return a named
	// destination (string) or an array representing an explicit destination.
	// Can be null when no explicit destination is available.
	// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
	dest: string | Array<any> | null;

	// If the outline entry points to an external URL, it will be here.
	url: string | null;

	// When PDF.js flags a URL as unsafe the raw value is available here.
	unsafeUrl?: string;

	// Whether the link should open in a new window/tab if rendered.
	newWindow?: boolean;

	// Number of child entries (if provided by the PDF). May be undefined.
	count?: number;

	// Child outline items. Type is kept loose to match PDF.js returns.
	// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
	items: Array<any>;
}

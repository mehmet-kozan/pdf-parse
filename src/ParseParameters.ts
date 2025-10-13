export interface ParseParameters {
	/**
	 * Array of page numbers to parse.
	 * When provided, only these pages will be parsed and returned in the same order.
	 * Example: [1, 3, 5]. Parse only one page: [7].
	 * Default: `undefined`.
	 */
	partial?: Array<number>;

	/**
	 * Parse the first N pages (pages 1..N).
	 * Ignored when `partial` is provided. If both `first` and `last` are set, they define
	 * an explicit inclusive page range (first..last) and this "first N" semantics is ignored.
	 * Default: `undefined`.
	 */
	first?: number;

	/**
	 * Parse the last N pages (pages total-N+1..total).
	 * Ignored when `partial` is provided. If both `first` and `last` are set, they define
	 * an explicit inclusive page range (first..last) and this "last N" semantics is ignored.
	 * Default: `undefined`.
	 */
	last?: number;

	/**
	 * Collect per-page metadata such as embedded links, title, pageLabel, and dimensions;
	 * ISBN, DOI, abstract, and references are work in progress when getInfo() is used.
	 * Default: `false`.
	 */
	parsePageInfo?: boolean;

	/**
	 * Attempt to detect and include hyperlink annotations (e.g. URLs) associated with text.
	 * Detected links are formatted as Markdown inline links (for example: [text](https://example.com)).
	 * Default: `false`.
	 */
	parseHyperlinks?: boolean;

	/**
	 * Enforce logical line breaks by inserting a newline when the vertical distance
	 * between text items exceeds `lineThreshold`.
	 * Useful to preserve paragraph/line structure when text items are emitted as separate segments.
	 * Default: `true`.
	 */
	lineEnforce?: boolean;

	/**
	 * Threshold to decide whether nearby text items belong to different lines.
	 * Larger values make the parser more likely to start a new line between items.
	 * Default: `4.6`.
	 */
	lineThreshold?: number;

	/**
	 * String inserted between text items on the same line when a sufficiently large horizontal gap is detected.
	 * Typically used to emulate a cell/column separator (for example, "\\t" for tabs).
	 * Default: `'\t'`.
	 */
	cellSeparator?: string;

	/**
	 * Horizontal distance threshold to decide when two text items on the same baseline should be treated as separate cells.
	 * Larger value produces fewer (wider) cells; smaller value creates more cell breaks.
	 * Default: `7`.
	 */
	cellThreshold?: number;

	/**
	 * Optional string appended at the end of each page's extracted text to mark page boundaries.
	 * Supports placeholders `page_number` and `total_number` which are substituted accordingly.
	 * If omitted or empty, no page boundary marker is added.
	 * Default: `'\n-- page_number of total_number --'`.
	 */
	pageJoiner?: string;

	/**
	 * Optional string used to join text items when returning a page's text.
	 * If provided, this value is used instead of the default empty-string joining behavior.
	 * Default: `undefined`.
	 */
	itemJoiner?: string;

	/**
	 * Minimum image dimension (in pixels) for width or height.
	 * When set, images where width OR height are below or equal this value will be ignored by `getImage()`.
	 * Useful for excluding tiny decorative or tracking images.
	 * Default: `80`.
	 * Disable: `0`.
	 */
	imageThreshold?: number;

	/**
	 * Screenshot scale factor: use 1 for the original size, 1.5 for a 50% larger image, etc.
	 * Default: `1`.
	 */
	scale?: number;

	/**
	 * Desired screenshot width in pixels.
	 * When set, the scale option is ignored.
	 * Default: `undefined`.
	 */
	desiredWidth?: number;

	/**
	 * Applies to both getImage() and getScreenshot(): include the image as a base64 data URL string.
	 * Default: `true`.
	 */
	imageDataUrl?: boolean;

	/**
	 * Applies to both getImage() and getScreenshot(): include the image as a binary buffer.
	 * Default: `true`.
	 */
	imageBuffer?: boolean;

	/**
	 * Include marked content items in the items array of TextContent to capture PDF "marked content".
	 * Enables tags (MCID, role/props) and structural/accessibility information useful for mapping text ↔ structure.
	 * For plain text extraction it's usually false (trade-off: larger output).
	 * Default: `false`.
	 */
	includeMarkedContent?: boolean;

	/**
	 * When true, text normalization is NOT performed in the worker thread.
	 * For plain text extraction, normalizing in the worker (false) is usually recommended.
	 * Default: `false`.
	 */
	disableNormalization?: boolean;
}

export type SafeParseParameters = Required<Pick<ParseParameters, 'lineThreshold' | 'cellThreshold' | 'scale'>> & ParseParameters;

export function setDefaultParseParameters(params: ParseParameters): SafeParseParameters {
	params.lineThreshold = params?.lineThreshold ?? 4.6;
	params.cellThreshold = params?.cellThreshold ?? 7;
	params.cellSeparator = params?.cellSeparator ?? '\t';
	params.lineEnforce = params?.lineEnforce ?? true;
	params.pageJoiner = params?.pageJoiner ?? '\n-- page_number of total_number --';
	params.imageThreshold = params?.imageThreshold ?? 80;

	params.imageDataUrl = params?.imageDataUrl ?? true;
	params.imageBuffer = params?.imageBuffer ?? true;
	params.scale = params?.scale ?? 1;

	return params as SafeParseParameters;
}

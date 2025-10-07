export interface ParseParameters {
	/**
	 * - When true, include marked content items in the items array of TextContent.
	 * - Enables capturing the PDF's "marked content"
	 * - Tags (MCID, role/props) and structural/accessibility information — e.g.
	 * - Semantic tagging, sectioning, spans, alternate/alternative text, etc.
	 * - How to use:
	 * - Turn it on when you need structure/tag information or to map text ↔ structure using MCIDs (for example with page.getStructTree()).
	 * - For plain text extraction it's usually left false (trade-off: larger output/increased detail).
	 *   Defaults to `false`.
	 */
	includeMarkedContent?: boolean | undefined;
	/**
	 * - When true, the text is *not* normalized in the worker thread.
	 * - Normalize in worker (false recommended for plain text)
	 *   Defaults to `false`.
	 */
	disableNormalization?: boolean | undefined;

	/**
	 * - When true, attempt to detect and include hyperlink annotations (e.g. URLs)
	 *   associated with text. Detected links are formatted as Markdown inline links
	 *   (for example: [link text](https://example.com)).
	 *   Defaults to `false`.
	 */
	parseHyperlinks?: boolean | undefined;

	/**
	 * - Array of 1-based page numbers to parse. When provided, only these pages
	 *   will be parsed and returned in the same order as specified.
	 *   Example: [1, 3, 5].
	 *   Parse only one page: [7].
	 */
	partial?: Array<number>;
	/**
	 * - If set to a positive integer N, parse the first N pages (pages 1..N).
	 *   Ignored when `partial` is provided.
	 * - If both `first` and `last` are set, they define an explicit inclusive
	 *   page range and only pages from `first` to `last` will be parsed. In that
	 *   case `first` is treated as the starting page number and the "first N"
	 *   semantics is ignored.
	 */
	first?: number;
	/**
	 * - If set to a positive integer N, parse the last N pages (pages total-N+1..total).
	 *   Ignored when `partial` is provided.
	 * - If both `first` and `last` are set, they define an explicit inclusive
	 *   page range and only pages from `first` to `last` will be parsed. In that
	 *   case `last` is treated as the ending page number and the "last N"
	 *   semantics is ignored.
	 */
	last?: number;
}

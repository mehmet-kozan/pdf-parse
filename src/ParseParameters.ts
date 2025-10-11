export interface ParseParameters {
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

	/**
	 * - When true, attempt to detect and include hyperlink annotations (e.g. URLs)
	 *   associated with text. Detected links are formatted as Markdown inline links
	 *   (for example: [link text](https://example.com)).
	 *   Defaults to `false`.
	 */
	parseHyperlinks?: boolean;

	/**
	 * - When true, the extractor will try to enforce logical line breaks by
	 *   inserting a newline between text items when the vertical distance
	 *   between them exceeds `lineThreshold`.
	 * - Useful to preserve paragraph/line structure when text items are
	 *   emitted as separate segments by the PDF renderer.
	 * - Default: `true`.
	 */
	lineEnforce?: boolean;

	/**
	 * - Threshold used to decide whether two nearby text
	 *   items belong to different lines. A larger value makes the parser more
	 *   likely to start a new line between items.
	 * - Default: `4.6`.
	 */
	lineThreshold?: number;

	/**
	 * - String inserted between text items on the same line when a sufficiently
	 *   large horizontal gap is detected (see `cellThreshold`). This is typically
	 *   used to emulate a cell/column separator (for example, a tab).
	 * - Example: `"\t"` to produce tab-separated cells.
	 * - Default: `'\t'`.
	 */
	cellSeparator?: string;

	/**
	 * - Horizontal distance threshold used to decide when
	 *   two text items on the same baseline should be considered separate cells
	 *   (and thus separated by `cellSeparator`).
	 * - A larger value produces fewer (wider) cells; smaller value creates more
	 *   cell breaks.
	 * - Default: `7`.
	 */
	cellThreshold?: number;

	/**
	 * - Optional string appended at the end of each page's extracted text to
	 *   mark page boundaries. The string supports the placeholders
	 *   `page_number` and `total_number`, which are substituted with the
	 *   current page number and total page count respectively.
	 * - If omitted or empty, no page boundary marker is added.
	 * - Default: `'\n-- page_number of total_number --'`
	 */
	pageJoiner?: string;

	/**
	 * - Optional string used to join text items when returning a page's text.
	 *   If provided, the extractor will use this value to join the sequence of
	 *   text items instead of the default empty-string joining behavior.
	 * - Use this to insert a custom separator between every text item.
	 * - Default: `undefined`
	 */
	itemJoiner?: string;

	/**
	 * - Minimum image width (in pixels). When set, images with a width smaller
	 *   than this value will be ignored by getImage().
	 * - Use to filter out very small embedded images (thumbnails, icons).
	 * - Default: undefined (no minimum).
	 */
	minImageWidth?: number;

	/**
	 * - Minimum image height (in pixels). When set, images with a height smaller
	 *   than this value will be ignored by getImage().
	 * - Use together with minImageWidth to require both dimensions to meet the threshold.
	 * - Default: undefined (no minimum).
	 */
	minImageHeight?: number;

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
	includeMarkedContent?: boolean;

	/**
	 * - When true, the text is *not* normalized in the worker thread.
	 * - Normalize in worker (false recommended for plain text)
	 *   Defaults to `false`.
	 */
	disableNormalization?: boolean;
}

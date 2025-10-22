/**
 * @public
 * Per-page link extraction result.
 * - pageNumber: the physical page index (1-based) within the PDF document.
 * - pageLabel: optional printed page label shown by PDF viewers (e.g. "iii", "1", "A-1");
 *              this can differ from the physical page number and may be undefined
 *              when the document does not provide labels.
 * - links: array of text-&gt;URL mappings that were found/overlaid on the page.
 * - width/height: page dimensions in PDF units for the viewport used.
 */
export type PageData = {
	// Physical page number (1-based index inside the PDF document).
	pageNumber: number;

	// Optional printed page label as displayed by PDF viewers. May be null/undefined
	// if the document does not provide explicit labels for pages.
	pageLabel?: string | null;

	// Hyperlinks that were overlaid or embedded on the page surface. Each entry
	// contains the visible text (if any) and the resolved URL.
	links: Array<{ text: string; url: string }>;

	// Page width
	width: number;
	// Page height
	height: number;
};

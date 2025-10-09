import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { Metadata } from 'pdfjs-dist/types/src/display/metadata.js';

const XMP_DATE_PROPERTIES = ['xmp:createdate', 'xmp:modifydate', 'xmp:metadatadate', 'xap:createdate', 'xap:modifydate', 'xap:metadatadate'];

export type { Metadata } from 'pdfjs-dist/types/src/display/metadata.js';

/**
 * Node representing a single item in the PDF outline (bookmarks).
 * This mirrors the structure returned by PDF.js' getOutline() API.
 */
export interface OutlineNode {
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

/**
 * Consolidated date information gathered from different PDF sources.
 * The PDF 'Info' dictionary contains CreationDate / ModDate and
 * the XMP/XAP metadata can contain several timestamps as well. This
 * structure collects those values (if present) as JavaScript Date objects
 * or null when the property exists but cannot be parsed.
 */
export type DateNode = {
	CreationDate?: Date | null;
	ModDate?: Date | null;
	XmpCreateDate?: Date | null;
	XmpModifyDate?: Date | null;
	XmpMetadataDate?: Date | null;
	XapCreateDate?: Date | null;
	XapModifyDate?: Date | null;
	XapMetadataDate?: Date | null;
};

/**
 * Per-page link extraction result.
 * - pageNumber: the physical page index (1-based) within the PDF document.
 * - pageLabel: optional printed page label shown by PDF viewers (e.g. "iii", "1", "A-1");
 *              this can differ from the physical page number and may be undefined
 *              when the document does not provide labels.
 * - links: array of text->URL mappings that were found/overlaid on the page.
 * - width/height: page dimensions in PDF units for the viewport used.
 */
export type PageLinkResult = {
	// Physical page number (1-based index inside the PDF document).
	pageNumber: number;

	// Optional printed page label as displayed by PDF viewers. May be null/undefined
	// if the document does not provide explicit labels for pages.
	pageLabel?: string | null;

	// Hyperlinks that were overlaid or embedded on the page surface. Each entry
	// contains the visible text (if any) and the resolved URL.
	links: Array<{ text: string; url: string }>;

	// Page width and height for the page viewport that was used when extracting links.
	width: number;
	height: number;
};

/**
 * Aggregated information about a PDF document returned by getInfo().
 * The object contains high-level metadata, outline/bookmark structure,
 * per-page extracted hyperlinks and utility helpers for parsing dates.
 */
export class InfoResult {
	// Total number of pages in the PDF document (count of physical pages).
	total: number;

	/**
	 * The PDF 'Info' dictionary. Typical fields include title, author, subject,
	 * Creator, Producer and Creation/Modification dates. The exact structure is
	 * determined by the PDF and as returned by PDF.js.
	 */
	// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
	info?: any;

	// Low-level document metadata object (XMP). Use this to access extended
	// properties that are not present in the Info dictionary.
	metadata?: Metadata;

	/**
	 * An array of document fingerprint strings provided by PDF.js. Useful
	 * for caching, de-duplication or identifying a document across runs.
	 */
	fingerprints?: Array<string | null>;

	/**
	 * Permission flags for the document as returned by PDF.js (or null).
	 * These flags indicate capabilities such as printing, copying and
	 * other restrictions imposed by the PDF security settings.
	 */
	permission?: number[] | null;

	/**
	 * Optional document outline (bookmarks). When present this is the
	 * hierarchical navigation structure which viewers use for quick access.
	 */
	outline?: Array<OutlineNode> | null;

	// Results with per-page hyperlink extraction. Empty array by default.
	pages: Array<PageLinkResult> = [];

	/**
	 * Collects dates from different sources (Info dictionary and XMP/XAP metadata)
	 * and returns them as a DateNode where available. This helps callers compare
	 * and choose the most relevant timestamp (for example a creation date vs XMP date).
	 */
	public getDateNode(): DateNode {
		const result: DateNode = {};

		// The Info dictionary may contain CreationDate/ModDate in PDF date string format.
		// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
		const CreationDate = (this.info as any)?.CreationDate;

		if (CreationDate) {
			result.CreationDate = pdfjs.PDFDateString.toDateObject(CreationDate);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
		const ModDate = (this.info as any)?.ModDate;

		if (ModDate) {
			result.ModDate = pdfjs.PDFDateString.toDateObject(ModDate);
		}

		// If no XMP metadata is present, return the Info-based dates only.
		if (!this.metadata) {
			return result;
		}

		// Extract several XMP/XAP date properties (if present) and attempt to
		// parse them as ISO-like strings. Parsed values are added to the
		// corresponding DateNode fields.
		for (const prop of XMP_DATE_PROPERTIES) {
			const value = this.metadata?.get(prop);
			const date = this.parseISODateString(value);

			switch (prop) {
				case XMP_DATE_PROPERTIES[0]:
					result.XmpCreateDate = date;
					break;
				case XMP_DATE_PROPERTIES[1]:
					result.XmpModifyDate = date;
					break;
				case XMP_DATE_PROPERTIES[2]:
					result.XmpMetadataDate = date;
					break;
				case XMP_DATE_PROPERTIES[3]:
					result.XapCreateDate = date;
					break;
				case XMP_DATE_PROPERTIES[4]:
					result.XapModifyDate = date;
					break;
				case XMP_DATE_PROPERTIES[5]:
					result.XapMetadataDate = date;
					break;
			}
		}

		return result;
	}

	/**
	 * Try to parse an ISO-8601 date string from XMP/XAP metadata. If the
	 * value is falsy or cannot be parsed, undefined is returned to indicate
	 * absence or unparsable input.
	 */
	private parseISODateString(isoDateString: string): Date | undefined {
		if (!isoDateString) return undefined;

		const parsedDate = Date.parse(isoDateString);
		if (!Number.isNaN(parsedDate)) {
			return new Date(parsedDate);
		}

		return undefined;
	}

	constructor(total: number) {
		this.total = total;
	}
}

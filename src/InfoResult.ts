import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { Metadata } from 'pdfjs-dist/types/src/display/metadata.js';

const XMP_DATE_PROPERTIES = ['xmp:createdate', 'xmp:modifydate', 'xmp:metadatadate', 'xap:createdate', 'xap:modifydate', 'xap:metadatadate'];

export type { Metadata } from 'pdfjs-dist/types/src/display/metadata.js';

export interface OutlineNode {
	title: string;
	bold: boolean;
	italic: boolean;
	color: Uint8ClampedArray;
	// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
	dest: string | Array<any> | null;
	url: string | null;
	unsafeUrl?: string;
	newWindow?: boolean;
	count?: number;
	// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
	items: Array<any>;
}

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

export type PageLinkResult = {
	// pdf page number
	pageNumber: number;

	// optional printed page label (as shown in PDF viewers). May be null/undefined when not available.
	pageLabel?: string | null;

	// page embed text hyperlinks
	links: Array<{ text: string; url: string }>;

	// page width
	width: number;

	// page height
	height: number;
};

export class InfoResult {
	// total pdf page number
	total: number;

	/**
	 *   The info object contains common fields like title,
	 *   author, subject, and creation/modify dates.
	 */
	// biome-ignore lint/suspicious/noExplicitAny: <unsupported underline type>
	info?: any;
	//document metadata, XMP metadata, XAP metadata
	metadata?: Metadata;

	/**
	 *   Document fingerprint(s).
	 *   Useful for identifying or caching documents.
	 */

	fingerprints?: Array<string | null>;

	/**
	 *   Document permissions.
	 *   This describes restrictions such as printing
	 *   or copying permissions.
	 */
	permission?: number[] | null;

	/**
	 * - Document outline / bookmarks.
	 *   This provides the top-level navigation/bookmark
	 *   structure when present. Defaults to `false`.
	 */
	outline?: Array<OutlineNode> | null;

	// text-level embed hyperlink
	pages: Array<PageLinkResult> = [];

	public getDateNode(): DateNode {
		const result: DateNode = {};

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

		if (!this.metadata) {
			return result;
		}

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

import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';

import { InfoData } from './InfoData.js';
import { MetaData } from './MetaData.js';
import type { OutlineData } from './OutlineData.js';
import type { PageData } from './PageData.js';
import { PermissionData } from './PermissionData.js';

/**
 * @public
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
	infoData: InfoData | null;

	// Low-level document metadata object (XMP). Use this to access extended
	// properties that are not present in the Info dictionary.
	metaData: MetaData | null;

	/**
	 * An array of document fingerprint strings provided by PDF.js. Useful
	 * for caching, de-duplication or identifying a document across runs.
	 */
	fingerprints?: Array<string | null>;

	permissionData: PermissionData | null;

	/**
	 * Optional document outline (bookmarks). When present this is the
	 * hierarchical navigation structure which viewers use for quick access.
	 */
	outlineData?: Array<OutlineData> | null;

	// Results with per-page hyperlink extraction. Empty array by default.
	pages: Array<PageData> = [];

	async load(doc: PDFDocumentProxy) {
		this.fingerprints = doc.fingerprints;

		const flags = await doc.getPermissions();
		this.permissionData = new PermissionData(flags);

		const { info, metadata } = await doc.getMetadata();

		if (info) {
			this.infoData = new InfoData(info);
		}

		if (metadata) {
			this.metaData = new MetaData(metadata);
		}

		this.outlineData = await doc.getOutline();
	}

	// biome-ignore lint/suspicious/noExplicitAny: toJson
	toJSON(): any {
		const plain = {
			total: this.total,
			infoData: this.infoData,
			metaData: this.metaData,
			fingerprints: this.fingerprints,
			permissionData: this.permissionData,
			outlineData: this.outlineData,
			pages: this.pages,
		};

		const seen = new WeakSet();
		const str = JSON.stringify(
			plain,
			(key, val) => {
				if (key === 'raw') return undefined; // omit raw fields
				if (val && typeof val === 'object') {
					if (seen.has(val)) return undefined; // avoid cycles
					seen.add(val);
				}
				return val;
			},
			2,
		);

		return JSON.parse(str);
	}

	constructor(numPages: number) {
		this.total = numPages;
		this.permissionData = null;
		this.infoData = null;
		this.metaData = null;
	}
}

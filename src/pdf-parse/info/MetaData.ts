import type { Metadata as RawMetadata } from 'pdfjs-dist/types/src/display/metadata.js';

import { logWarn, sanitize } from '../Utils.js';

export type { Metadata as RawMetadata } from 'pdfjs-dist/types/src/display/metadata.js';

export class MetaData {
	public raw?: RawMetadata;
	public dc_creator?: string | string[];
	public dc_format?: string;
	public dc_subject?: string | string[];
	public dc_title?: string;
	public pdf_producer?: string;
	public xmp_creatortool?: string;
	public xmp_createdate?: Date | null;
	public xmp_metadatadate?: Date | null;
	public xmp_modifydate?: Date | null;
	public xap_createdate?: Date | null;
	public xap_metadatadate?: Date | null;
	public xap_modifydate?: Date | null;

	/**
	 * Try to parse an ISO-8601 date string from XMP/XAP metadata. If the
	 * value is falsy or cannot be parsed, undefined is returned to indicate
	 * absence or unparsable input.
	 */
	private parseISODateString(isoDateString: string): Date | null {
		if (!isoDateString) return null;

		const parsedDate = Date.parse(isoDateString);
		if (!Number.isNaN(parsedDate)) {
			return new Date(parsedDate);
		}

		return null;
	}

	constructor(raw: RawMetadata) {
		this.raw = raw;
		if (raw) {
			// biome-ignore lint/suspicious/noExplicitAny: complex underline object
			const meta = {} as any;
			for (const [key, value] of raw) {
				if (typeof key === 'string') {
					const newKey = key.replaceAll(':', '_');
					meta[newKey] = sanitize(value);

					if (newKey.endsWith('date')) {
						meta[newKey] = this.parseISODateString(meta[newKey]);
					}
				} else {
					logWarn('Metadata key value not string!..');
				}
			}

			Object.assign(this, meta);
		}
	}
}

import { sanitize, toDateObject } from '../Utils.js';

export class InfoData {
	/**
	 * The PDF 'Info' dictionary. Typical fields include title, author, subject,
	 * Creator, Producer and Creation/Modification dates. The exact structure is
	 * determined by the PDF and as returned by PDF.js.
	 */

	// biome-ignore lint/complexity/noBannedTypes: underline type
	readonly raw?: Object;

	/**
	 * the title
	 *
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Title?: string;
	/**
	 * the author
	 *
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Author?: string;
	/**
	 * the subject
	 *
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Subject?: string;
	/**
	 * the keywords
	 *
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Keywords?: string;
	/**
	 * the creator
	 *
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Creator?: string;
	/**
	 * the producer
	 *
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Producer?: string;
	/**
	 * the creation date
	 *
	 * @readonly
	 * @type {Date | null | undefined}
	 */
	readonly CreationDate?: Date | null;
	/**
	 * the modification date
	 *
	 * @readonly
	 * @type {Date | null | undefined}
	 */
	readonly ModDate?: Date | null;
	/**
	 * the trapped
	 *
	 * @readonly
	 * @type {{name: string} | undefined}
	 */
	readonly Trapped?: { name: string };
	/**
	 * the format version
	 *
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly PDFFormatVersion?: string;
	/**
	 * if it is linearized
	 *
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsLinearized?: boolean;
	/**
	 * if acro form is present
	 *
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsAcroFormPresent?: boolean;
	/**
	 * if xfa form is present
	 *
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsXFAPresent?: boolean;
	/**
	 * if collection is present
	 *
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsCollectionPresent?: boolean;
	/**
	 * if signatures are present
	 *
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsSignaturesPresent?: boolean;
	// biome-ignore lint/complexity/noBannedTypes: underline type
	readonly [key: string]: string | number | Date | boolean | { name: string } | Object | undefined | null;

	// biome-ignore lint/complexity/noBannedTypes: underline lib return Object
	constructor(info?: Object) {
		this.raw = info;
		if (info) {
			const object: Record<string, string | Date | null> = JSON.parse(JSON.stringify(info));
			for (const key in object) {
				if (typeof object[key] === 'string') {
					object[key] = sanitize(object[key]) as string;

					if (key.endsWith('Date')) {
						object[key] = toDateObject(object[key]);
					}
				}
			}

			Object.assign(this, object);
		}
	}
}

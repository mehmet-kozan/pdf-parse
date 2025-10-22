import { PermissionFlag } from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * Represents the permissions of a PDF document based on security settings.
 */
export class PermissionData {
	/**
	 * These raw flags indicate capabilities such as printing, copying and
	 * other restrictions imposed by the PDF security settings.
	 */
	public raw?: number[] | null;

	/**
	 * Indicates whether assembling the document is allowed.
	 */
	public assemble: boolean = true;
	/**
	 * Indicates whether copying the content is allowed.
	 */
	public copy: boolean = true;
	/**
	 * Indicates whether filling interactive forms is allowed.
	 */
	public fillInteractiveForms: boolean = true;
	/**
	 * Indicates whether modifying annotations is allowed.
	 */
	public modifyAnnotations: boolean = true;
	/**
	 * Indicates whether modifying contents is allowed.
	 */
	public modifyContents: boolean = true;
	/**
	 * Indicates whether printing is allowed.
	 */
	public print: boolean = true;
	/**
	 * Indicates whether high-quality printing is allowed.
	 */
	public printHQ: boolean = true;
	/**
	 * Indicates whether copying the content for accessibility is allowed.
	 */
	public copyForAccessibility: boolean = true;

	constructor(flags?: number[] | null) {
		this.raw = flags;

		if (this.raw) {
			this.assemble = this.raw.includes(PermissionFlag.ASSEMBLE);
			this.copy = this.raw.includes(PermissionFlag.COPY);
			this.copyForAccessibility = this.raw.includes(PermissionFlag.COPY_FOR_ACCESSIBILITY);
			this.fillInteractiveForms = this.raw.includes(PermissionFlag.FILL_INTERACTIVE_FORMS);
			this.modifyAnnotations = this.raw.includes(PermissionFlag.MODIFY_ANNOTATIONS);
			this.modifyContents = this.raw.includes(PermissionFlag.MODIFY_CONTENTS);
			this.print = this.raw.includes(PermissionFlag.PRINT);
			this.printHQ = this.raw.includes(PermissionFlag.PRINT_HIGH_QUALITY);
		}
	}
}

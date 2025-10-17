/** biome-ignore-all lint/suspicious/noExplicitAny: <canvas> */

/**
 * Gets the absolute path to the PDF worker file.
 * @returns {string} The absolute path to the PDF worker module (pdf.worker.mjs)
 */
export declare function getWorkerPath(): string;

/**
 * Gets the base64 data URL.
 * @returns {string} base64 data URL (pdf.worker.mjs)
 */
export declare function getWorkerSource(): string;

export interface CanvasAndContext {
	canvas: import('@napi-rs/canvas').Canvas | null;
	context: import('@napi-rs/canvas').SKRSContext2D | null;
}

export declare class CustomCanvasFactory {
	create(width: number, height: number): CanvasAndContext;
	reset(canvasAndContext: CanvasAndContext, width: number, height: number): void;
	destroy(canvasAndContext: CanvasAndContext): void;
}

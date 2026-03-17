// Lazy-loading canvas factory to avoid loading @napi-rs/canvas until needed
// This prevents Jest "CustomGC" open handle warnings for text-only operations

let canvasModule: typeof import('@napi-rs/canvas') | null = null;
let canvasLoaded = false;

export function isCanvasLoaded(): boolean {
	return canvasLoaded;
}

export function clearCanvasCache(): void {
	if (canvasModule && typeof canvasModule.clearAllCache === 'function') {
		canvasModule.clearAllCache();
	}
}

export interface LazyCanvasAndContext {
	canvas: import('@napi-rs/canvas').Canvas | null;
	context: import('@napi-rs/canvas').SKRSContext2D | null;
}

export interface LazyCanvasFactoryOptions {
	ownerDocument?: HTMLDocument;
	enableHWA?: boolean;
}

export class LazyCanvasFactory {
	#enableHWA: boolean;

	constructor(options?: LazyCanvasFactoryOptions) {
		this.#enableHWA = options?.enableHWA ?? false;
	}

	create(width: number, height: number): LazyCanvasAndContext {
		if (width <= 0 || height <= 0) {
			throw new Error('Invalid canvas size');
		}

		if (!canvasModule) {
			canvasModule = require('@napi-rs/canvas') as typeof import('@napi-rs/canvas');
			canvasLoaded = true;
			// Set globals required by pdfjs-dist
			// biome-ignore lint/suspicious/noExplicitAny: global assignment
			(global as any).DOMMatrix = canvasModule.DOMMatrix;
			// biome-ignore lint/suspicious/noExplicitAny: global assignment
			(global as any).Path2D = canvasModule.Path2D;
			// biome-ignore lint/suspicious/noExplicitAny: global assignment
			(global as any).ImageData = canvasModule.ImageData;
		}

		const canvas = canvasModule.createCanvas(width, height);
		const context = canvas.getContext('2d');
		return { canvas, context };
	}

	reset(canvasAndContext: LazyCanvasAndContext, width: number, height: number): void {
		if (!canvasAndContext.canvas) {
			throw new Error('Canvas is not specified');
		}
		if (width <= 0 || height <= 0) {
			throw new Error('Invalid canvas size');
		}
		canvasAndContext.canvas.width = width;
		canvasAndContext.canvas.height = height;
	}

	destroy(canvasAndContext: LazyCanvasAndContext): void {
		if (!canvasAndContext.canvas) {
			throw new Error('Canvas is not specified');
		}
		canvasAndContext.canvas.width = 0;
		canvasAndContext.canvas.height = 0;
		canvasAndContext.canvas = null;
		canvasAndContext.context = null;
	}
}

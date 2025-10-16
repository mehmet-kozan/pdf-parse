import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';

globalThis.DOMMatrix = DOMMatrix;
globalThis.Path2D = Path2D;
globalThis.ImageData = ImageData;

export class CustomCanvasFactory {
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: <constructor>
	#enableHWA = false;
	constructor({ enableHWA = false }) {
		this.#enableHWA = enableHWA;
	}
	create(width, height) {
		if (width <= 0 || height <= 0) {
			throw new Error('Invalid canvas size');
		}
		const canvas = createCanvas(width, height);
		const context = canvas.getContext('2d');
		return { canvas, context };
	}

	reset(canvasAndContext, width, height) {
		if (!canvasAndContext.canvas) {
			throw new Error('Canvas is not specified');
		}
		if (width <= 0 || height <= 0) {
			throw new Error('Invalid canvas size');
		}
		canvasAndContext.canvas.width = width;
		canvasAndContext.canvas.height = height;
	}

	destroy(canvasAndContext) {
		if (!canvasAndContext.canvas) {
			throw new Error('Canvas is not specified');
		}
		canvasAndContext.canvas.width = 0;
		canvasAndContext.canvas.height = 0;
		canvasAndContext.canvas = null;
		canvasAndContext.context = null;
	}
}

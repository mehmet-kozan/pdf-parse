import { type Canvas, createCanvas, type SKRSContext2D } from '@napi-rs/canvas';

export interface CanvasAndContext {
	canvas: Canvas | null;
	context: SKRSContext2D | null;
}

export class CustomCanvasFactory {
	create(width: number, height: number): CanvasAndContext {
		if (width <= 0 || height <= 0) {
			throw new Error('Invalid canvas size');
		}
		const canvas = createCanvas(width, height);
		const context = canvas.getContext('2d');
		return { canvas, context };
	}

	reset(canvasAndContext: CanvasAndContext, width: number, height: number): void {
		if (!canvasAndContext.canvas) {
			throw new Error('Canvas is not specified');
		}
		if (width <= 0 || height <= 0) {
			throw new Error('Invalid canvas size');
		}
		canvasAndContext.canvas.width = width;
		canvasAndContext.canvas.height = height;
	}

	destroy(canvasAndContext: CanvasAndContext): void {
		if (!canvasAndContext.canvas) {
			throw new Error('Canvas is not specified');
		}
		canvasAndContext.canvas.width = 0;
		canvasAndContext.canvas.height = 0;
		canvasAndContext.canvas = null;
		canvasAndContext.context = null;
	}
}

// class NodeCanvasFactory extends BaseCanvasFactory {
//   _createCanvas(width, height) {
//     const require = process.getBuiltinModule("module").createRequire(import.meta.url);
//     const canvas = require("@napi-rs/canvas");
//     return canvas.createCanvas(width, height);
//   }
// }

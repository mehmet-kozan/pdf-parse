/** biome-ignore-all lint/suspicious/noExplicitAny: global declaration */
import { Canvas, createCanvas, DOMMatrix, ImageData, Path2D, type SKRSContext2D } from '@napi-rs/canvas';

(global as any).DOMMatrix = DOMMatrix;
(global as any).Path2D = Path2D;
(global as any).ImageData = ImageData;

export { Canvas, type SKRSContext2D };

export interface CanvasAndContext {
	canvas: Canvas | null;
	context: SKRSContext2D | null;
}

export class CanvasFactory {
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

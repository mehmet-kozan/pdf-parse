import { Shape } from './Shape.js';

export class Point extends Shape {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		super();
		this.x = x;
		this.y = y;
	}

	public equal(point: Point): boolean {
		return point.x === this.x && point.y === this.y;
	}

	public transform(matrix: Array<number>): this {
		const p = Shape.applyTransform([this.x, this.y], matrix);
		this.x = p[0];
		this.y = p[1];
		return this;
	}
}

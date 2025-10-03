import { Line } from './Line.js';
import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Rectangle extends Shape {
	public from: Point;
	public width: number;
	public height: number;

	constructor(from: Point, width: number, height: number) {
		super();
		this.from = from;
		this.width = width;
		this.height = height;
	}

	public get to(): Point {
		return new Point(this.from.x + this.width, this.from.y + this.height);
	}

	public getLines(): Line[] {
		const to = this.to;

		const lines: Array<Line> = [
			new Line(this.from, new Point(to.x, this.from.y)),
			new Line(this.from, new Point(this.from.x, to.y)),
			new Line(new Point(to.x, this.from.y), to),
			new Line(new Point(this.from.x, to.y), to),
		];
		return lines.filter((l) => l.valid);
	}

	public transform(matrix: Array<number>): this {
		const p1 = Shape.applyTransform([this.from.x, this.from.y], matrix);
		const p2 = Shape.applyTransform([this.from.x + this.width, this.from.y + this.height], matrix);

		const x = Math.min(p1[0], p2[0]);
		const y = Math.min(p1[1], p2[1]);

		const width = Math.abs(p1[0] - p2[0]);
		const height = Math.abs(p1[1] - p2[1]);

		this.from = new Point(x, y);
		this.width = width;
		this.height = height;
		return this;
	}
}

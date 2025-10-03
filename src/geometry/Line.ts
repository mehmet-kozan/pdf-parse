import { Point } from './Point.js';
import { Shape } from './Shape.js';

export enum LineDirection {
	None = 0,
	Horizontal = 1,
	Vertical,
}

export class Line extends Shape {
	public from: Point;
	public to: Point;
	public direction: LineDirection = LineDirection.None;
	public length: number = 0;
	public intersections: Array<Point> = [];
	public gaps: Array<Line> = [];

	constructor(from: Point, to: Point) {
		super();
		this.from = from;
		this.to = to;
		this.init();
	}

	private init(): void {
		let from = this.from;
		let to = this.to;

		if (Math.abs(from.y - to.y) < Shape.tolerance) {
			this.direction = LineDirection.Horizontal;
			to.y = from.y;
			if (from.x > to.x) {
				const temp = from;
				from = to;
				to = temp;
			}
			this.length = to.x - from.x;
		} else if (Math.abs(from.x - to.x) < Shape.tolerance) {
			this.direction = LineDirection.Vertical;
			to.x = from.x;
			if (from.y > to.y) {
				const temp = from;
				from = to;
				to = temp;
			}
			this.length = to.y - from.y;
		}

		this.from = from;
		this.to = to;
	}

	private _valid: boolean | undefined = undefined;

	get valid(): boolean {
		if (this._valid === undefined) {
			this._valid = this.direction !== LineDirection.None && this.length > Shape.tolerance;
		}
		return this._valid;
	}

	get normalized(): Line {
		if (this.direction === LineDirection.Horizontal) {
			return new Line(new Point(this.from.x - Shape.tolerance, this.from.y), new Point(this.to.x + Shape.tolerance, this.from.y));
		} else if (this.direction === LineDirection.Vertical) {
			return new Line(new Point(this.from.x, this.from.y - Shape.tolerance), new Point(this.from.x, this.to.y + Shape.tolerance));
		}
		return this;
	}

	public addGap(line: Line): void {
		this.gaps.push(line);
	}

	public containsPoint(p: Point): boolean {
		if (this.direction === LineDirection.Vertical) {
			return this.from.x === p.x && p.y >= this.from.y && p.y <= this.to.y;
		} else if (this.direction === LineDirection.Horizontal) {
			return this.from.y === p.y && p.x >= this.from.x && p.x <= this.to.x;
		}
		return false;
	}

	// // todo implement
	// public containsLine(l:Line):boolean{
	//     if(this.direction === LineDirection.Vertical && l.direction === LineDirection.Vertical){
	//         return this.from.x === l.from.x
	//     }
	//     else if(this.direction === LineDirection.Horizontal && l.direction === LineDirection.Horizontal){
	//         return this.from.y === l.from.y
	//     }
	//     return false
	// }

	public addIntersectionPoint(point: Point): void {
		for (const intPoint of this.intersections) {
			if (intPoint.equal(point)) return;
		}
		this.intersections.push(point);
	}

	public intersection(line: Line): Point | undefined {
		let result: Point | undefined;

		if (!this.valid || !line.valid) {
			return result;
		}

		const thisNormalized = this.normalized;
		const lineNormalized = line.normalized;

		if (this.direction === LineDirection.Horizontal && line.direction === LineDirection.Vertical) {
			const x = lineNormalized.from.x;
			const y = thisNormalized.from.y;
			const isOk = x > thisNormalized.from.x && x < thisNormalized.to.x && y > lineNormalized.from.y && y < lineNormalized.to.y;

			if (isOk) {
				const intPoint = new Point(x, y);
				this.addIntersectionPoint(intPoint);
				line.addIntersectionPoint(intPoint);
				result = intPoint;
			}
		} else if (this.direction === LineDirection.Vertical && line.direction === LineDirection.Horizontal) {
			const x = thisNormalized.from.x;
			const y = lineNormalized.from.y;
			const isOk = x > lineNormalized.from.x && x < lineNormalized.to.x && y > thisNormalized.from.y && y < thisNormalized.to.y;

			if (isOk) {
				const intPoint = new Point(x, y);
				this.addIntersectionPoint(intPoint);
				line.addIntersectionPoint(intPoint);
				result = intPoint;
			}
		}

		// if(result){
		//     for (const gapLine of this.gaps) {
		//         if(gapLine.containsPoint(result)) return undefined
		//     }
		//
		//     for (const gapLine of line.gaps) {
		//         if(gapLine.containsPoint(result)) return undefined
		//     }
		// }

		return result;
	}

	public transform(matrix: Array<number>): this {
		const p1 = this.from.transform(matrix);
		const p2 = this.to.transform(matrix);

		const x = Math.min(p1.x, p2.x);
		const y = Math.min(p1.y, p2.y);

		const width = Math.abs(p1.x - p2.x);
		const height = Math.abs(p1.y - p2.y);

		this.from = new Point(x, y);
		this.to = new Point(x + width, y + height);
		this.init();
		return this;
	}
}

export abstract class Shape {
	static tolerance = 2;
	public abstract transform(matrix: Array<number>): this;

	static applyTransform(p: Array<number>, m: Array<number>): Array<number> {
		const xt = p[0] * m[0] + p[1] * m[2] + m[4];
		const yt = p[0] * m[1] + p[1] * m[3] + m[5];
		return [xt, yt];
	}
}

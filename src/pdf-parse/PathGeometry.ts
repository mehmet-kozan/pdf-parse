export type MinMax = [number, number, number, number];

export enum PathGeometry {
	undefined = 0,
	hline = 1,
	vline = 2,
	rectangle = 3,
}

export enum DrawOPS {
	moveTo = 0,
	lineTo = 1,
	curveTo = 2,
	closePath = 3,
	rectangle = 4,
}

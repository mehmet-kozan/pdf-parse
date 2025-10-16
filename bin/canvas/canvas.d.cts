/** biome-ignore-all lint/suspicious/noExplicitAny: <canvas> */
declare class CustomCanvasFactory {
	constructor(options: { enableHWA?: boolean });
	create(width: number, height: number): { canvas: any; context: any };
	reset(canvasAndContext: { canvas: any; context: any }, width: number, height: number): void;
	destroy(canvasAndContext: { canvas: any; context: any }): void;
}

export = CustomCanvasFactory;

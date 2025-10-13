import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 5;
	pages = [
		{
			num: 1,
			texts: ['Exercise is one of the low-cost and easiest ways for improving life standards'],
		},
		{
			num: 5,
			texts: ['accounts for the biological activity of endothelium-derived'],
		},
	];
}

export const data = new TestData(import.meta.url);

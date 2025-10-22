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
	pageInfoData = [
		{
			pageNumber: 1,
			links: [],
			width: 595,
			height: 842,
			pageLabel: '362',
		},
		{
			pageNumber: 2,
			links: [],
			width: 595,
			height: 842,
			pageLabel: '363',
		},
		{
			pageNumber: 3,
			links: [],
			width: 595,
			height: 842,
			pageLabel: '364',
		},
		{
			pageNumber: 4,
			links: [],
			width: 595,
			height: 842,
			pageLabel: '365',
		},
		{
			pageNumber: 5,
			links: [],
			width: 595,
			height: 842,
			pageLabel: undefined,
		},
	];
}

export const data = new TestData(import.meta.url);

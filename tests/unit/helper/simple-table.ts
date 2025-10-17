import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 1;
	pages = [
		{
			num: 1,
			texts: [],
			tables: [
				[
					['1', '2', '3', '4'],
					['10', '20', '30', '40'],
					['100', '200', '300', '400'],
					['1000', '2000', '3000', '4000'],
				],
			],
		},
	];
}

export const data = new TestData(import.meta.url);

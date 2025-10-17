import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 1;
	pages = [
		{
			num: 1,
			texts: [],
			tables: [],
		},
	];
}

export const data = new TestData(import.meta.url);

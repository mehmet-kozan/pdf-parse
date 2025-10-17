import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 1;
	pages = [
		{
			num: 1,
			texts: ['Dadfrtfjh,mgf', 'v.0.01'],
		},
	];
}

export const data = new TestData(import.meta.url);

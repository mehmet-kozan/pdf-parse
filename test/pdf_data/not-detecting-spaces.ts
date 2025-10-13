import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 1;
	pages = [
		{
			num: 1,
			texts: ['Samsung’s', '5 nm', 'finFET process'],
		},
	];
}

export const data = new TestData(import.meta.url);

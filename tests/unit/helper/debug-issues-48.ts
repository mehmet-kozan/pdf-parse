import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 1;
	pages = [
		{
			num: 1,
			texts: [],
			tables: [
				[
					['Header1', 'Header2', 'Header3'],
					['Test1', 'Test2', 'Test3'],
					['Test4', 'Test5', 'Test6'],
					['Test7', 'Test8', 'Test9'],
					['Test10', 'Test11', 'Test12'],
				],
			],
		},
	];
}

export const data = new TestData(import.meta.url);

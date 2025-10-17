import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 6;
	pages = [
		{
			num: 1,
			seperatorCount: 108,
			texts: ['AGI-(Groß-)Region #52. KW #1. KW #2. KW #3. KW #4. KW #5. KW', 'Süden 158 #163 #150 #151 #188 #199'],
		},
	];
}

export const data = new TestData(import.meta.url);

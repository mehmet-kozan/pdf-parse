import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 7;
	pages = [
		{
			num: 2,
			texts: [
				'AGI-(Groß-)Region 12. KW 13. KW 14. KW 15. KW 16. KW 17. KW 18. KW 19. KW',
				'Süden 183 139 83 52 39 37 36 31',
			],
		},
	];
}

export const data = new TestData(import.meta.url);

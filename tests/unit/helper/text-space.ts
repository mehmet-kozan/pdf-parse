import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 7;
	pages = [
		{
			num: 1,
			texts: ['Publicidad', '26.994', 'plantea', 'Protección de la vivienda única e inscripción registral'],
		},
	];
}

export const data = new TestData(import.meta.url);

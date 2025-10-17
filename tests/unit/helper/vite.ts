import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 35;
	pages = [];
}

export const data = new TestData(import.meta.url);

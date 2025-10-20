import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 1;
	pages = [];
}

export const data = new TestData(import.meta.url);

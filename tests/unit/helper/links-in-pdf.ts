import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 2;
	pages = [];
	infos = [];
}

export const data = new TestData(import.meta.url);

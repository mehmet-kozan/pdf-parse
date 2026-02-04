/** biome-ignore-all format: long base64 */
import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 1;
	pages = [
		{
			num: 1,
			texts: ['Text-01', 'Text-02'],
			imgs: [
				{
					name: 'img_p0_1',
					/* biome-ignore format: long base64 */
					dataHash:'71269f83fd8575898e881f04fb92d167',
				},
			],
		},
	];
}

export const data = new TestData(import.meta.url);

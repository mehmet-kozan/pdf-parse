import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 5;
	pages = [
		{
			num: 1,
			texts: ['According to literature, solar cells', 'investigated four different TJ designs'],
			imgs: [
				{
					name: 'img_p0_1',
					// biome-ignore format: too-long
					dataHash:'cbb33502ea904216e4a8241189621e0f',
				},
			],
		},
		{
			num: 5,
			texts: [
				'fabricated by multi layer precursor method for improvement of its photo',
				'royal Institute of Technology, Stockholm',
			],
		},
	];
}

export const data = new TestData(import.meta.url);

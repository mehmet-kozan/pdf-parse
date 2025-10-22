import { data as data01 } from '../helper/default-test';
import { data as data02 } from '../helper/hyperlinks-test';
import { data as data03 } from '../helper/links-in-pdf';
import { type PageData, PDFParse } from 'pdf-parse';
import { describe, expect, test } from 'vitest';

describe('get-info test', () => {
	test(data01.fileName, async () => {
		const buffer = await data01.getBuffer();
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getInfo();
		expect(result.total).toEqual(data01.total);
		expect(result.pages.length).toEqual(0);
		expect(result.infoData?.PDFFormatVersion).toEqual('1.4');
		expect(result.infoData?.Producer).toEqual('pdfeTeX-1.21a');
		expect(result.infoData?.Creator).toEqual('TeX');
		expect(result.infoData?.CreationDate).toBeInstanceOf(Date);
		expect(result.infoData?.CreationDate?.getTime()).toEqual(1238629165000);
	});

	test(data02.fileName, async () => {
		const buffer = await data02.getBuffer();
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getInfo({ parsePageInfo: true });
		expect(result.total).toEqual(data02.total);
		// original pdf file name
		expect(result.infoData?.Title).toEqual('hyperlinks-test-pdf');
		expect(result.infoData?.PDFFormatVersion).toEqual('1.4');
		expect(result.infoData?.Producer).toEqual('Skia/PDF m142 Google Docs Renderer');

		// check hyperlinks results
		expect(result.pages.length).toEqual(1);

		const pageData: PageData = result.pages[0];

		expect(pageData).toMatchObject({
			pageNumber: 1,
			links: [
				{
					url: 'https://duckduckgo.com/',
					text: 'Duck Duck Go 1',
				},
				{
					url: 'https://duckduckgo.com/',
					text: 'Duck Duck Go 2',
				},
			],
			width: 596,
			height: 842,
		});
	});

	test(data03.fileName, async () => {
		const buffer = await data03.getBuffer();
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getInfo({ parsePageInfo: true });
		expect(result.total).toEqual(data03.total);
		expect(result.infoData?.PDFFormatVersion).toEqual('1.5');
		expect(result.infoData?.Producer).toEqual('Antenna House PDF Output Library 7.4.1889');
		expect(result.infoData?.Creator).toEqual(
			'Antenna House Formatter V7.4 R1 Windows : 7.4.1.63121 (2023-12-20T11:05+09)',
		);

		expect(result.infoData?.CreationDate).toBeInstanceOf(Date);
		expect(result.infoData?.CreationDate?.getTime()).toEqual(1705970362000);

		expect(result.infoData?.CreationDate).toBeInstanceOf(Date);
		expect(result.infoData?.ModDate).toBeInstanceOf(Date);
		expect(result.infoData?.CreationDate?.getFullYear()).toBe(2024);
		expect(result.infoData?.ModDate?.getFullYear()).toBe(2024);

		// Verify XMP dates are parsed
		expect(result.metaData?.xmp_createdate).toBeInstanceOf(Date);
		expect(result.metaData?.xmp_modifydate).toBeInstanceOf(Date);
		expect(result.metaData?.xmp_metadatadate).toBeInstanceOf(Date);
		expect(result.metaData?.xmp_createdate?.getFullYear()).toBe(2024);

		expect(result.metaData?.xap_createdate).toBeUndefined();
		expect(result.metaData?.xap_modifydate).toBeUndefined();
		expect(result.metaData?.xap_metadatadate).toBeUndefined();

		expect(result.pages).toMatchObject([
			{
				pageNumber: 1,
				links: [
					{
						url: 'https://www.antennahouse.com/',
						text: 'Antenna House, Inc.',
					},
					{
						url: './attachment-sample-1.pdf',
						text: 'Linking to an external file (attachment-sample-1.pdf).',
					},
					{
						url: 'https://www.antennahouse.com/',
						text: 'Linking to a website (https://www.antennahouse.com/)',
					},
				],
				width: 595.27563,
				height: 841.88977,
			},
			{
				pageNumber: 2,
				links: [
					{
						url: 'https://www.antennahouse.com/',
						text: 'Antenna House, Inc.',
					},
					{
						url: 'https://www.antennahouse.com/',
						text: 'https://www.antennahouse.com/',
					},
				],
				width: 595.27563,
				height: 841.88977,
			},
		]);
	});
});

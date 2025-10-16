import '../pdf_data/_helper';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { type PageLinkResult, PDFParse } from '../../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);

describe('get-info test', () => {
	test('pdf-common.pdf', async () => {
		const buffer = await readFile(join(__dir, 'pdf-common.pdf'));
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getInfo();
		expect(result.total).toEqual(14);
		expect(result.pages.length).toEqual(0);
		expect(result.info?.PDFFormatVersion).toEqual('1.4');
		expect(result.info?.Producer).toEqual('pdfeTeX-1.21a');
		expect(result.info?.Creator).toEqual('TeX');
		expect(result.info?.CreationDate).toEqual("D:20090401163925-07'00'");

		const dateNode = result.getDateNode();
		expect(dateNode.CreationDate).toBeInstanceOf(Date);
		expect(dateNode.CreationDate?.getTime()).toEqual(1238629165000);
	});

	test('pdf-links-simple.pdf', async () => {
		const buffer = await readFile(join(__dir, 'pdf-links-simple.pdf'));
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getInfo({ parsePageInfo: true });
		expect(result.total).toEqual(1);
		// original pdf file name
		expect(result.info?.Title).toEqual('hyperlinks-test-pdf');
		expect(result.info?.PDFFormatVersion).toEqual('1.4');
		expect(result.info?.Producer).toEqual('Skia/PDF m142 Google Docs Renderer');

		// check hyperlinks results
		expect(result.pages.length).toEqual(1);

		const pageResult: PageLinkResult = result.pages[0];

		expect(pageResult).toMatchObject({
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

	test('pdf-links-all.pdf', async () => {
		const buffer = await readFile(join(__dir, 'pdf-links-all.pdf'));
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getInfo({ parsePageInfo: true });
		expect(result.total).toEqual(2);
		expect(result.info?.PDFFormatVersion).toEqual('1.5');
		expect(result.info?.Producer).toEqual('Antenna House PDF Output Library 7.4.1889');
		expect(result.info?.Creator).toEqual('Antenna House Formatter V7.4 R1 Windows : 7.4.1.63121 (2023-12-20T11:05+09)');
		expect(result.info?.CreationDate).toEqual("D:20240123093922+09'00'");

		const dateNode = result.getDateNode();
		expect(dateNode.CreationDate).toBeInstanceOf(Date);
		expect(dateNode.CreationDate?.getTime()).toEqual(1705970362000);

		expect(dateNode.CreationDate).toBeInstanceOf(Date);
		expect(dateNode.ModDate).toBeInstanceOf(Date);
		expect(dateNode.CreationDate?.getFullYear()).toBe(2024);
		expect(dateNode.ModDate?.getFullYear()).toBe(2024);

		// Verify XMP dates are parsed
		expect(dateNode.XmpCreateDate).toBeInstanceOf(Date);
		expect(dateNode.XmpModifyDate).toBeInstanceOf(Date);
		expect(dateNode.XmpMetadataDate).toBeInstanceOf(Date);
		expect(dateNode.XmpCreateDate?.getFullYear()).toBe(2024);

		expect(dateNode.XapCreateDate).toBeUndefined();
		expect(dateNode.XapModifyDate).toBeUndefined();
		expect(dateNode.XapMetadataDate).toBeUndefined();

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

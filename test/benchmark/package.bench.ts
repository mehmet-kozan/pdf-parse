import fs from 'node:fs';
import path from 'node:path';
import { bench, describe } from 'vitest';
import { PDFParse } from '../../src/index';

describe('Parsing Files', () => {
	bench('pdf-parse', () => {});
	// bench('@iptv/playlist', () => {
	//   parseM3U(playlistString)
	// })

	// bench('iptv-playlist-parser', () => {
	//   ippParser.parse(playlistString)
	// })

	// bench('esx-iptv-playlist-parser', () => {
	//   esxParser.parse(playlistString)
	// })
});

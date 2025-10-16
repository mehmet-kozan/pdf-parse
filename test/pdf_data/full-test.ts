import { PDFFile } from './_helper.ts';

class TestData extends PDFFile {
	total = 14;
	pages = [
		{
			num: 1,
			texts: [
				'Trace-based Just-in-Time Type Specialization',
				'Just-in-Time Type Specialization for',
				'Languages',
				'Andreas Gal∗+, Brendan Eich∗, Mike Shaver∗, David Anderson∗, David Mandelin∗',
			],
		},
		{
			num: 2,
			texts: ['We solve the nested loop problem'],
		},
		{
			num: 5,
			texts: ['With this approach we are able to cover type-unstable'],
		},
		{
			num: 6,
			texts: ['TraceMonkey does not currently support recording'],
		},
		{
			num: 7,
			texts: ['The key insight is that if each loop is represented'],
		},
		{
			num: 8,
			texts: ['JavaScript object values are mappings of string-valued property', 'Because traces are in SSA form and have no join points'],
		},
		{
			num: 13,
			texts: ['This paper described how to run dynamic languages efficiently by'],
		},
		{
			num: 14,
			texts: ['A. Rigo. Representation-Based Just-In-time Specialization', 'not be interpreted as necessarily representing the official views'],
		},
	];
}

export const data = new TestData(import.meta.url);

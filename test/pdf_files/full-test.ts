import { PDFFile } from './_helper';

class TestData extends PDFFile {
	total = 14;
	pages = [
		{
			num: 1,
			texts: ['Trace-based Just-in-Time Type Specialization'],
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
			texts: ['JavaScript object values are mappings of string-valued property'],
		},
		{
			num: 13,
			texts: ['This paper described how to run dynamic languages efficiently by'],
		},
		{
			num: 14,
			texts: ['A. Rigo. Representation-Based Just-In-time Specialization'],
		},
	];
}

export const data = new TestData(import.meta.url);

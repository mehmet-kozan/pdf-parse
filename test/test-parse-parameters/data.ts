export const TestData = {
	total: 14,
	pages: [
		{
			num: 1,
			text: 'Trace-based Just-in-Time Type Specialization',
		},
		{
			num: 2,
			text: 'We solve the nested loop problem',
		},
		{
			num: 5,
			text: 'With this approach we are able to cover type-unstable',
		},
		{
			num: 6,
			text: 'TraceMonkey does not currently support recording',
		},
		{
			num: 7,
			text: 'The key insight is that if each loop is represented',
		},
		{
			num: 8,
			text: 'JavaScript object values are mappings of string-valued property',
		},
		{
			num: 13,
			text: 'This paper described how to run dynamic languages efficiently by',
		},
		{
			num: 14,
			text: 'A. Rigo. Representation-Based Just-In-time Specialization',
		},
	],
	getPageText(num: number): string {
		for (const pageData of this.pages) {
			if (pageData.num === num) return pageData.text;
		}
		return '_XXYYZZ!!';
	},
};

// CommonJS entry that lazily loads the ESM bundle via dynamic import.
// This keeps ESM (index.js) as the single source of truth.

let esmModule: any;
let esmPromise: Promise<any> | null = null;

async function loadEsm() {
	if (!esmPromise) {
		esmPromise = import('./index.js').then((m) => {
			esmModule = m;
			return m;
		});
	}
	return esmPromise;
}

// CJS: module.exports is a proxy that forwards property access to the ESM module.
// First property access triggers the dynamic import.
module.exports = new Proxy(
	{},
	{
		get(_target, prop: string | symbol) {
			// Support special Node checks like typeof require('pkg') === 'function'
			if (prop === '__esModule') return true;
			if (prop === 'then') {
				// Allow `await require('pdf-parse')` if someone really wants it.
				return undefined;
			}

			// If ESM already loaded, return directly
			if (esmModule) {
				return (esmModule as any)[prop];
			}

			// Not yet loaded: kick off async import.
			loadEsm();
			return undefined;
		},
		has(_target, prop: string | symbol) {
			if (esmModule) {
				return prop in esmModule;
			}
			return false;
		},
	},
);

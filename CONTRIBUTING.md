# Contributing to pdf-parse

## Reporting issues

When reporting issues, please:
- Attach the PDF file that causes the problem (if possible)
- Include steps to reproduce the problem
- Include any error messages or stack traces

Useful details to include:
- Runtime environment: Are you running in a browser or in Node.js?
- Module format: Are you using ESM or CommonJS?
- Deployment: Next.js / Vercel, Netlify Functions, AWS Lambda, Cloudflare Workers, Edge Functions, etc.
- If you're using TypeScript, please attach your `tsconfig.json` (if relevant).
- Which bundler/build tool are you using (Vite, webpack, Rollup, etc.)?

## Visual Studio Code

Recommended VS Code setup for contributors:

- Extensions (see `.vscode/extensions.json`):
	- `vitest.explorer` — run and debug Vitest tests inside VS Code.
	- `biomejs.biome` — Biome formatter and linter (project default formatter).
	- `redhat.vscode-yaml` — YAML formatting for CI/workflow files.
	- `ritwickdey.liveserver` — optional, useful for previewing browser examples.

- Key editor settings (from `.vscode/settings.json`):
	- Auto-format on save enabled (`editor.formatOnSave: true`) with Biome set as the default formatter for JS/TS/JSON.
	- `editor.codeActionsOnSave` configured to fix imports and run Biome fixes automatically.
	- YAML files use `redhat.vscode-yaml` as formatter with 2-space indentation.
	- Prefer relative imports for TypeScript/JavaScript (`importModuleSpecifier: relative`).

- Debug & test launch configurations (`.vscode/launch.json`):
	- "debug current file": launch Node to debug the active file with `--inspect-brk`.
	- "debug vitest current file": run Vitest for the current test file (good for stepping through tests).
	- "debug vitest all file": run all Vitest tests via the workspace Vitest binary.

## Scripts

The following scripts are defined in `package.json` to help with development and releases. Use `npm run <script>` to run them.

### Build scripts
- `npm run build`: Run all build tasks: `clean`, `build:ts`, `build:node`, `build:browser`, and `build:worker`.
- `npm run build:ts`: Compile TypeScript outputs (ESM + CJS) and adjust CJS filenames.
- `npm run build:node`: Build the Node bundle via Vite (`vite.config.node.ts`).
- `npm run build:browser`: Build the browser bundles (`vite.config.browser.ts` and `vite.config.browser.min.ts`).
- `npm run build:worker`: Build the worker helper, Vite (`vite.config.worker.ts`).

### Clean scripts
- `npm run clean`: Run all clean tasks: `clean:build`, `clean:site`, `clean:test`, and `clean:test:i`.

### Test & bench scripts
- `npm test`: Run all tests once (no watch) using Vitest (`vitest run --reporter=default`).
- `npm run test:i`: Run integration tests via `node scripts/integration.test.mjs`.
- `npm run test:ui`: Start the Vitest UI with coverage enabled.
- `npm run test:watch`: Run Vitest in watch mode.
- `npm run coverage`: Run Vitest and collect coverage.
- `npm run bench`: Install the benchmark helper and run Vitest benchmarks (`bench:install` then `vitest bench --run`).
- `npm run bench:install`: Install the `pdf2json` package locally without saving it to `package.json` (used for some benchmarks).

### Site & other
- `npm run report`: Run `report:build` then preview the `reports` site output with Vite.
- `npm run report:build`: Build the project and generate coverage and benchmarks for the site.
- `npm run prepare`: Run before publishing; currently runs the build.
- `npm run pack`: Perform a dry-run of `npm pack` to verify package contents.

### Code quality
- `npm run lint`: Run Biome linter over the repository.
- `npm run format`: Format files in-place with Biome.
- `npm run format:all`: Run Biome in write/check mode to fix code-style issues.
- `npm run format:check`: Check formatting without modifying files.

## Dependencies

This project uses a small set of runtime and development dependencies. Key items are listed below.

### Runtime
- `pdfjs-dist` (^5.4.296) — Mozilla's PDF.js distribution; the core engine for parsing PDF files.

### Optional runtime
- `@napi-rs/canvas` (^0.1.80) — optional native canvas implementation used when available; listed under `optionalDependencies`.

### Development
- `vite` (^7.1.5) — build tool used for bundling Node/browser/worker targets.
- `vitest` (^3.2.4) — test runner.
- `typescript` (^5.9.3) — TypeScript compiler.
- `@biomejs/biome` (^2.2.6) — formatter & linter.
- `@types/node` (^24.7.2) — Node.js type definitions.
- `@vitest/coverage-v8` (^3.2.4) — V8-based coverage provider for Vitest.
- `@vitest/ui` (^3.2.4) — optional Vitest UI for interactive test runs.
- `rimraf` (^6.0.1) — cross-platform rm -rf replacement used in scripts.

### Key configuration files
- `tsconfig.json` — main TypeScript configuration.
- `tsconfig.node.json` — secondary TypeScript config used to emit CJS artifacts.
- `vite.config.*.ts` — Vite build configurations for different targets (Node, browser, worker, minified browser).
- `vitest.config.ts` — Vitest configuration.
- `biome.json` — Biome formatter/linter configuration.

## Development guidelines

- Write clear, readable code with appropriate comments.
- Add tests for new features or bug fixes.
- Update documentation when adding features or changing behavior.
- Follow the existing code style (enforced by Biome).
- Ensure tests pass locally before opening a PR.
- Keep pull requests focused on a single logical change.

## Testing with PDF files

- Add the binary PDF files under `reports/pdf`. File names should match the helper/test metadata entries.
- For test metadata  add a matching `.ts` file in `tests/unit/helper`. 
- Each data file typically exports a `PDFFile` subclass instance (see `_helper.ts`).

Running tests:
- Unit tests: `npm test` (runs Vitest once).
- Watch mode / interactive UI: `npm run test:watch` or `npm run test:ui`.
- Integration tests: `npm run test:i` (runs `scripts/integration.test.mjs`).

When adding a test:
- Add the `.pdf` to `reports/pdf` and commit the file (or a small sanitized sample when PDFs are large or private).
- Add a `.ts` metadata file to `tests/unit/helper/` that extends `PDFFile` and exports the `data` instance.
- Add a test in the appropriate `test/test-XX/` folder that imports the `data` instance and asserts expected results.

## How to contribute

Short summary: fork the repo, create a branch, make changes with tests, run `npm run build` and `npm test`, then push and open a PR. 

## Questions

If you have questions about contributing, open an issue.
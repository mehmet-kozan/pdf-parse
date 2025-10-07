# Contributing to pdf-parse

## Reporting Issues

When reporting issues, please:
- **Attach the PDF file** that causes the problem (if possible)
- Provide a clear description of the issue
- Include steps to reproduce the problem
- Specify your environment (Node.js version, browser, OS, pnpm, yarn)
- Include any error messages or stack traces

## Scripts

The following scripts are available in `package.json` to help with development:

### Build Scripts
- **`npm run build`**: Builds all versions (ESM, CJS, browser, and minified browser) and cleans artifacts
- **`npm run build:esm`**: Builds the ES module version using TypeScript compiler
- **`npm run build:cjs`**: Builds the CommonJS version using Vite
- **`npm run build:browser`**: Builds the browser version
- **`npm run build:browser:min`**: Builds the minified browser version
- **`npm run clean`**: Removes build artifacts and test outputs (dist, test txt files, and images)
- **`npm run clean:site`**: Removes site artifacts (test-report, coverage, benchmark, demo/dist-browser)

### Testing Scripts
- **`npm test`**: Runs all tests once (no watch mode) using Vitest
- **`npm run test:ui`**: Opens the Vitest UI with coverage for interactive test viewing
- **`npm run test:watch`**: Runs all tests in watch mode
- **`npm run coverage`**: Runs tests and generates code coverage report
- **`npm run bench`**: Runs benchmark tests using Vitest

### Code Quality Scripts
- **`npm run lint`**: Lints the codebase using Biome
- **`npm run format`**: Formats the code using Biome
- **`npm run format:all`**: Formats and fixes all code quality issues
- **`npm run format:check`**: Checks formatting without making changes

### Site & Other Scripts
- **`npm run site:build`**: Builds the project and generates coverage reports for the site
- **`npm run site:view`**: Previews the example browser application
- **`npm run prepare`**: Automatically runs build before publishing (pre-publish hook)
- **`npm run pack`**: Performs a dry-run of `npm pack` to verify package contents

## Development Dependencies

This project uses several key dependencies for development. Understanding these tools will help you contribute more effectively:

### Core Dependencies
- **`pdfjs-dist`** (^5.4.296): Mozilla's PDF.js library - the core engine for parsing PDF files

### Build Tools
- **`typescript`** (^5.9.3): TypeScript compiler for type-safe JavaScript development
- **`vite`** (^7.1.5): Fast build tool and development server for building browser and Node.js versions
- **`vite-plugin-dts`** (^4.5.4): Vite plugin for generating TypeScript declaration files (.d.ts)

### Testing Framework
- **`vitest`** (^3.2.4): Fast unit test framework with native ESM support
- **`@vitest/ui`** (^3.2.4): Interactive UI for viewing and debugging tests
- **`@vitest/coverage-v8`** (^3.2.4): Code coverage reporting using V8's native coverage

### Code Quality
- **`@biomejs/biome`** (^2.2.5): Fast formatter and linter for JavaScript/TypeScript - replaces ESLint and Prettier with better performance

### Utilities
- **`npm-run-all`** (^4.1.5): Run multiple npm scripts sequentially or in parallel
- **`rimraf`** (^6.0.1): Cross-platform tool for removing files and directories
- **`@types/node`** (^24.7.0): TypeScript type definitions for Node.js APIs

### Key Configuration Files
- **`tsconfig.json`**: TypeScript compiler configuration
- **`vite.config.*.ts`**: Vite build configurations for different targets (ESM, CJS, browser, minified)
- **`vitest.config.js`**: Vitest test runner configuration
- **`biome.json`**: Biome code quality configuration

## Development Guidelines

- Write clear, readable code with appropriate comments
- Add tests for new features or bug fixes
- Update documentation when adding new features
- Follow the existing code style (enforced by Biome)
- Ensure all tests pass before submitting a pull request
- Keep pull requests focused on a single feature or fix

## Testing with PDF Files

When working with PDF-related issues:
- Add test PDFs to the appropriate `test/test-XX/` directory
- Create corresponding test files (e.g., `pdf-text.test.ts`, `pdf-image.test.ts`)
- Include expected output data in `data.ts` files
- Test both text extraction, image extraction, and table detection features

## How to Contribute

Follow these steps to contribute to the project:

1. **Fork the Repository**  
   Fork the `pdf-parse` repository to your own GitHub account by clicking the "Fork" button at the top of the [repository page](https://github.com/mehmet-kozan/pdf-parse).

2. **Clone the Forked Repository**  
   Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/pdf-parse.git
   cd pdf-parse
   ```

3. **Install Dependencies**  
   Install the required dependencies:
   ```bash
   npm install
   ```

4. **Create a Branch**  
   Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make Your Changes**  
   Make your changes to the codebase. Ensure your code follows the project's coding standards.

6. **Test Your Changes**  
   Run the tests to ensure everything works correctly:
   ```bash
   npm test
   ```

7. **Build the Project**  
   Build the project to ensure there are no build errors:
   ```bash
   npm run build
   ```

8. **Commit Your Changes**  
   Commit your changes with a clear and descriptive commit message:
   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

9. **Push to Your Fork**  
   Push your changes to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```

10. **Open a Pull Request**  
    Open a pull request from your fork to the main repository. Provide a clear description of your changes and reference any related issues.

## Questions?

If you have questions about contributing, feel free to open an issue or discussion on the [GitHub repository](https://github.com/mehmet-kozan/pdf-parse).
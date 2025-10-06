# Contributing to pdf-parse

Thank you for your interest in contributing to `pdf-parse`! We welcome contributions from the community to help improve this PDF parsing library. Whether you're fixing bugs, adding features, improving documentation, or reporting issues, your efforts are greatly appreciated.

> **Important Note:** When opening an issue, please attach the relevant PDF file if possible. Providing the PDF file will help us reproduce and resolve your issue more efficiently.

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

## Reporting Issues

When reporting issues, please:
- **Attach the PDF file** that causes the problem (if possible)
- Provide a clear description of the issue
- Include steps to reproduce the problem
- Specify your environment (Node.js version, browser, OS)
- Include any error messages or stack traces

## Scripts

The following scripts are available in `package.json` to help with development:

### Build Scripts
- **`npm run build`**: Builds all versions (ESM, CJS, browser, and minified browser)
- **`npm run build:esm`**: Builds the ES module version using TypeScript compiler
- **`npm run build:cjs`**: Builds the CommonJS version using Vite
- **`npm run build:browser`**: Builds the browser version
- **`npm run build:browser:min`**: Builds the minified browser version
- **`npm run clean`**: Removes build artifacts and test outputs

### Testing Scripts
- **`npm test`**: Runs all tests in watch mode using Vitest
- **`npm run test:run`**: Runs all tests once (no watch mode)
- **`npm run test:ui`**: Opens the Vitest UI for interactive test viewing
- **`npm run coverage`**: Runs tests and generates code coverage report

### Code Quality Scripts
- **`npm run lint`**: Lints the codebase using Biome
- **`npm run format`**: Formats the code using Biome
- **`npm run format:all`**: Formats and fixes all code quality issues
- **`npm run format:check`**: Checks formatting without making changes

### Other Scripts
- **`npm run prepare`**: Automatically runs build before publishing (pre-publish hook)
- **`npm run pkg:check`**: Performs a dry-run of `npm pack` to verify package contents
- **`npm run serve:example`**: Serves the example application for testing

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

## Questions?

If you have questions about contributing, feel free to open an issue or discussion on the [GitHub repository](https://github.com/mehmet-kozan/pdf-parse).
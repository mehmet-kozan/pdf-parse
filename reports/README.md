# Test & Coverage Reports

This directory contains test results and code coverage reports for the pdf-parse project.

## 📁 Directory Structure

```
reports/
├── index.html          # Landing page for viewing reports
├── test/               # Test results (auto-generated)
│   └── index.html
└── coverage/           # Code coverage reports (auto-generated)
    └── index.html
```

## 🧪 Generating Reports Locally

### Run Tests Only
```bash
npm test
# or
npm run test:run
```

### Generate Test HTML Report
```bash
npm run test:run
# Test report will be generated in: reports/test/
```

### Generate Coverage Report
```bash
npm run coverage
# Coverage report will be generated in: reports/coverage/
```

### View Test UI (Interactive)
```bash
npm run test:ui
# Opens interactive test UI in browser
```

### View Reports
```bash
npm run report
# Opens report UI in browser
```

## 🌐 GitHub Pages

Reports are automatically deployed to GitHub Pages on every push to the `main` branch:

- **Landing Page**: https://mehmet-kozan.github.io/pdf-parse/
- **Test Report**: https://mehmet-kozan.github.io/pdf-parse/test/
- **Coverage Report**: https://mehmet-kozan.github.io/pdf-parse/coverage/

## 🔧 Configuration

### Test Configuration
Test configuration is defined in `vitest.config.js`:
- Test reporter: HTML
- Output directory: `./reports/test/`

### Coverage Configuration
Coverage configuration is also in `vitest.config.js`:
- Provider: v8
- Reporter: HTML, JSON Summary
- Output directory: `./reports/coverage/`
- Includes: `src/**/*.ts`
- Excludes: `src/**/*.d.ts`, `src/types/**`, `src/index.cjs.ts`

## 🧹 Cleaning Reports

```bash
# Clean all generated files including reports
npm run clean

# This will remove:
# - dist/
# - test/**/*.txt
# - test/**/imgs
# - reports/test/
# - reports/coverage/
```

## 📝 Notes

- `reports/test/` and `reports/coverage/` are git-ignored (auto-generated)
- `reports/index.html` is tracked in git (can be manually edited)
- Reports are regenerated on every test/coverage run
- GitHub Actions automatically deploys reports to GitHub Pages

## 🚀 CI/CD

The GitHub Actions workflow (`.github/workflows/test.yml`) automatically:
1. Runs tests on every push to any branch
2. Generates test and coverage reports on `main` branch
3. Deploys reports to GitHub Pages

## 📚 Learn More

- [Vitest Documentation](https://vitest.dev/)
- [Vitest Coverage](https://vitest.dev/guide/coverage.html)
- [Vitest UI](https://vitest.dev/guide/ui.html)

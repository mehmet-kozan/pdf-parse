## Test, Coverage & Benchmark Reports and Live Demo

- This directory contains test, code coverage, benchmark reports and web demo for the pdf-parse project.
- This directory automatically deployed to GitHub Pages on every push to the `main` branch
- **Live Site**: [https://mehmet-kozan.github.io/pdf-parse/](https://mehmet-kozan.github.io/pdf-parse/)

## 📁 Directory Structure

```
reports/
├── index.html          # Landing page for viewing reports
├── test-report/        # Test reports (auto-generated)
│   └── index.html
└── coverage/           # Code coverage reports (auto-generated)
    └── index.html
```

## 🧪 Generating Reports Locally

```bash
# Test reports will be generated in: reports/
npm run report:build


# Generate reports ans run site
npm run report

# Clean all generated files including reports
npm run clean
```

## 🌐 GitHub Pages

Reports are automatically deployed to GitHub Pages on every push to the `main` branch:

- **Landing Page**: https://mehmet-kozan.github.io/pdf-parse/
- **Test Report**: https://mehmet-kozan.github.io/pdf-parse/test/
- **Coverage Report**: https://mehmet-kozan.github.io/pdf-parse/coverage/

## 🧹 Cleaning Reports

```bash
# Clean all generated files including reports
npm run clean

## 📝 Notes

- `pdf-parse/test-report/` and `pdf-parse/coverage/` are git-ignored (auto-generated)
- `pdf-parse/index.html` is tracked in git (can be manually edited)
- Reports are regenerated on every test/coverage run
- GitHub Actions automatically deploys reports to GitHub Pages

## 🚀 CI/CD
The GitHub Actions workflow [`deploy_github_page`](`.github/workflows/deploy_github_page.yml`)
1. Runs tests on every push to `main` branch
2. Deploys reports to GitHub Pages

## 📚 Learn More

- [Vitest Documentation](https://vitest.dev/)
- [Vitest Coverage](https://vitest.dev/guide/coverage.html)
- [Vitest UI](https://vitest.dev/guide/ui.html)

# PDF-Parse CLI Tool

A command-line interface for extracting data from PDF files using the pdf-parse library.

## Installation

The CLI tool is included with the pdf-parse package. If you have pdf-parse installed, the CLI is available as `pdf-parse`.

```bash
npm install -g pdf-parse
```

## Updating

To update to the latest version:

```bash
npm update -g pdf-parse
```


## Uninstallation

To remove the CLI tool:

```bash
npm uninstall -g pdf-parse
```

## Usage

```bash
pdf-parse <command> <file> [options]
```

Where `<file>` can be a local PDF file path or a URL (for certain commands).

## Commands

### check
Check PDF file headers and validate format. Only works with URLs.

```bash
pdf-parse check https://example.com/document.pdf
```

### info
Extract PDF metadata and information.

```bash
pdf-parse info document.pdf
```

### text
Extract text content from PDF pages.

```bash
pdf-parse text document.pdf --pages 1-3
```

### image
Extract embedded images from PDF pages.

```bash
pdf-parse image document.pdf --output ./images/
```

### screenshot (alias: ss)
Generate screenshots of PDF pages.

```bash
pdf-parse screenshot document.pdf --output ./screenshots/ --scale 2.0
```

### table
Extract tabular data from PDF pages.

```bash
pdf-parse table document.pdf --format json
```

## Options

- `-o, --output <file>`: Output file path (for single file) or directory (for multiple files)
- `-p, --pages <range>`: Page range (e.g., 1,3-5,7)
- `-f, --format <format>`: Output format (json, text, dataurl)
- `-m, --min <px>`: Minimum image size threshold in pixels (default: 80)
- `-s, --scale <factor>`: Scale factor for screenshots (default: 1.0)
- `-w, --width <px>`: Desired width for screenshots in pixels
- `--magic`: Validate PDF magic bytes (default: true)
- `-h, --help`: Show help message
- `-v, --version`: Show version number

## Examples

### Basic Usage

Get PDF information:
```bash
pdf-parse info mydocument.pdf
```

Extract text from specific pages:
```bash
pdf-parse text mydocument.pdf --pages 1,3-5
```

### Image Extraction

Extract all images to a directory:
```bash
pdf-parse image mydocument.pdf --output ./extracted-images/
```

Extract images with minimum size filter:
```bash
pdf-parse image mydocument.pdf --min 100 --output ./images/
```

### Screenshots

Generate screenshots with custom scale:
```bash
pdf-parse screenshot mydocument.pdf --scale 1.5 --output ./screenshots/
```

Generate screenshots with specific width:
```bash
pdf-parse screenshot mydocument.pdf --width 800 --output ./screenshots/
```

### Table Extraction

Extract tables in JSON format:
```bash
pdf-parse table mydocument.pdf --format json --output tables.json
```

Extract tables from specific pages:
```bash
pdf-parse table mydocument.pdf --pages 2-4
```

### Header Validation

Check PDF headers from URL:
```bash
pdf-parse check https://example.com/document.pdf
```

Check without magic byte validation:
```bash
pdf-parse check https://example.com/document.pdf --no-magic
```

### Output Formats

Save results to file:
```bash
pdf-parse info mydocument.pdf --output info.txt
pdf-parse text mydocument.pdf --format json --output content.json
```

## Output Formats

### Text Format (default)
Human-readable text output for most commands.

### JSON Format
Structured data output using `--format json`.

### Data URL Format
Base64 encoded data URLs for image and screenshot commands using `--format dataurl`.

## Page Ranges

Specify page ranges using comma-separated values and ranges:

- `1`: Page 1
- `1,3,5`: Pages 1, 3, and 5
- `1-5`: Pages 1 through 5
- `1,3-5,7`: Pages 1, 3, 4, 5, and 7

## Error Handling

The CLI tool provides clear error messages for common issues:

- Invalid commands or options
- Missing required arguments
- File not found or inaccessible
- Invalid page ranges
- Network errors for URL-based operations

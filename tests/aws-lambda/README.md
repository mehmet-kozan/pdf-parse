# AWS Lambda Testing with Docker

This directory contains Docker-based tests for AWS Lambda compatibility.

## Prerequisites

- Docker
- Docker Compose

## Running Tests

### Using Docker Compose (Local Build)

```bash
# Build and start Lambda container with local code
cd tests/aws-lambda
docker-compose up --build

# In another terminal, invoke the function
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{"pdfUrl":"https://bitcoin.org/bitcoin.pdf","operation":"text"}'
```

### Using Test Script

```bash
# Make script executable
chmod +x tests/aws-lambda/test.sh

# Run tests
./tests/aws-lambda/test.sh
```

## Supported Operations

### ✅ Text Extraction (Fully Supported)
```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{"pdfUrl":"https://bitcoin.org/bitcoin.pdf","operation":"text"}'
```

### ✅ Metadata Extraction (Fully Supported)
```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{"pdfUrl":"https://bitcoin.org/bitcoin.pdf","operation":"info"}'
```

### ⚠️ Table Extraction (May Require Canvas)
```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{"pdfUrl":"https://bitcoin.org/bitcoin.pdf","operation":"table"}'
```

**Note:** Table extraction may fail with `Failed to load native binding` error if it requires canvas operations.

## Expected Response

### Success Response
```json
{
  "statusCode": 200,
  "body": "{\"success\":true,\"operation\":\"text\",\"pageCount\":9,\"data\":{\"textLength\":15000,\"firstPage\":\"Bitcoin: A Peer-to-Peer Electronic Cash System...\"}}"
}
```

### Error Response
```json
{
  "statusCode": 500,
  "body": "{\"success\":false,\"error\":\"Error message\",\"errorType\":\"Error\",\"stack\":\"...\"}"
}
```

## Notes

- The container uses AWS Lambda Node.js 24 runtime
- **Local code is copied and built inside the container**
- Worker files are automatically loaded via `require('pdf-parse/worker')`
- Tests verify that pdf-parse works correctly in serverless environment

### Canvas Operations & Limitations

Canvas-based operations require `@napi-rs/canvas` native bindings:

**✅ Working in Lambda (no canvas required):**
- `getText()` — Text extraction
- `getInfo()` — Metadata extraction  
- `getRaw()` — Raw text data
- `getParagraph()` — Paragraph extraction

**⚠️ May fail in Lambda (canvas required):**
- `getScreenshot()` — Page rendering
- `getImage()` — Image extraction
- `getTable()` — Table detection (if canvas-based)

**Error:** `Failed to load native binding` or `exit status 1`

**Solutions:**
1. Use text/info operations only
2. Deploy on platforms with native dependency support (Vercel, Netlify, Cloudflare Workers with proper setup)
3. Build custom Lambda layer with pre-compiled `@napi-rs/canvas` binaries
4. Use AWS Lambda container with system dependencies installed

### Testing with Published Package

To test the published npm package instead of local build:

1. Update Dockerfile:

```dockerfile
# Install pdf-parse from npm (latest or specific version)
RUN npm install pdf-parse@latest --omit=dev

# Copy only the Lambda handler
COPY tests/aws-lambda/handler.js ./handler.js
```

2. Rebuild: `docker-compose up --build`

## Troubleshooting

### Check container logs
```bash
docker-compose logs lambda
```

### Interactive debugging
```bash
# Start container
docker-compose up -d

# Access container shell
docker exec -it aws-lambda-lambda-1 sh

# Check installed packages
ls -la node_modules/pdf-parse/

# Test handler manually
node -e "const h = require('./handler'); h.handler({}).then(console.log)"
```

### Clean rebuild
```bash
# Remove containers and images
docker-compose down --rmi all

# Rebuild
docker-compose up --build
```

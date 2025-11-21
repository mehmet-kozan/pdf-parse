#!/bin/bash

# Build and start Lambda container
docker-compose -f tests/aws-lambda/docker-compose.yml up -d --build

# Wait for container to be ready
echo "Waiting for Lambda container to start..."
sleep 5

# Test with text operation (no canvas required)
echo "Testing getText() operation..."
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{"pdfUrl":"https://bitcoin.org/bitcoin.pdf","operation":"text"}'

echo -e "\n\nTesting getInfo() operation..."
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{"pdfUrl":"https://mehmet-kozan.github.io/pdf-parse/pdf/climate.pdf","operation":"info"}'

# Note: getTable() may fail due to canvas requirements in Lambda
echo -e "\n\nTesting getTable() operation (may fail)..."
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{"pdfUrl":"https://mehmet-kozan.github.io/pdf-parse/pdf/simple-table.pdf","operation":"table"}'

# Cleanup
echo -e "\n\nStopping container..."
docker-compose -f tests/aws-lambda/docker-compose.yml down

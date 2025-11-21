# AWS Lambda Node.js 24 runtime (AMD64 for Windows compatibility)
# https://gallery.ecr.aws/lambda/nodejs
FROM public.ecr.aws/lambda/nodejs:24

# Set working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy code directory
COPY ./tests/aws-lambda/code ./code

# Change to code directory and install dependencies
WORKDIR ${LAMBDA_TASK_ROOT}/code
RUN npm install --omit=dev

# Return to task root
WORKDIR ${LAMBDA_TASK_ROOT}

# Set the CMD to handler in code directory
CMD [ "code/handler.handler" ]

// AWS Lambda handler for testing pdf-parse (CommonJS)

exports.handler = async function handler(event) {
	try {
		// Load pdf-parse from local node_modules
		console.log('Loading pdf-parse/worker...');
		//require('pdf-parse/worker');
		console.log('Worker loaded successfully');

		console.log('Loading PDFParse...');
		const { PDFParse } = require('pdf-parse');
		console.log('PDFParse loaded successfully');

		const pdfUrl = event.pdfUrl || 'https://bitcoin.org/bitcoin.pdf';
		const operation = event.operation || 'text'; // text, info, table

		console.log(`Creating parser for URL: ${pdfUrl}`);
		const parser = new PDFParse({ url: pdfUrl });

		let result;
		console.log(`Running operation: ${operation}`);

		switch (operation) {
			case 'info':
				result = await parser.getInfo({ parsePageInfo: true });
				break;
			case 'table':
				try {
					result = await parser.getTable();
				} catch (tableError) {
					console.error('Table extraction failed:', tableError.message);
					console.error('Stack:', tableError.stack);
					throw new Error(`Table extraction not supported in Lambda: ${tableError.message}`);
				}
				break;
			case 'text':
			default:
				result = await parser.getText();
				break;
		}

		console.log('Operation completed successfully');
		await parser.destroy();

		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				operation,
				pageCount: result.total,
				data:
					operation === 'text'
						? {
								textLength: result.text.length,
								firstPage: result.pages[0]?.text?.substring(0, 200),
							}
						: operation === 'table'
							? {
									tableCount: result.pages[0]?.tables?.length || 0,
								}
							: {
									title: result.infoData?.Title,
									author: result.infoData?.Author,
								},
			}),
		};
	} catch (error) {
		console.error('Handler error:', error.message);
		console.error('Error type:', error.constructor.name);
		console.error('Stack trace:', error.stack);

		// Log additional error details
		if (error.cause) {
			console.error('Error cause:', error.cause);
		}

		return {
			statusCode: 500,
			body: JSON.stringify({
				success: false,
				error: error.message,
				errorType: error.constructor.name,
				stack: error.stack,
			}),
		};
	}
};

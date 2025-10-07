const { default: listen } = require('async-listen')
const { createServer } = require('node:http');
const os = require('node:os')
const createBrowser = require('browserless');
const pdf = require('pdf-parse');
const local_pdf = require('../../dist/cjs/index.cjs');



async function runServer(handler){
  const server = createServer(async (req, res) => {
    await handler({ req, res })
  });

  const url = await listen(server);
  url.hostname = os.hostname();
  const urlStr = url.toString();
  return {server, url:urlStr}
}

const getUrl = runServer(({ res }) => {
    res.setHeader('Content-Type', 'text/html')
    return res.end(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <p>hello world</p>
    </body>
    </html>`)
  });

async function run() {

    try{

        const browser = createBrowser();
        const browserless = await browser.createContext();
        const {server, url} = await getUrl;
        const buffer = await browserless.pdf(url);
        server.close();
        const data = await pdf(buffer);
        const local_data = await local_pdf(buffer);

        if(data.text.includes('hello world') && local_data.text.includes('hello world')){
            process.exit(0);
        }
        else{
            process.exit(1);
        }

    }
    catch{
        process.exit(1);
    }

}

run();



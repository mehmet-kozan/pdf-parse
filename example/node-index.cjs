const pdf  = require('../dist/cjs/index.cjs');
const fs = require('fs');
const path = require('path');



const file = path.join(__dirname,'../data/test.pdf');
const data = fs.readFileSync(file);

pdf(data).then(result=>{
    console.log(result.text);
});
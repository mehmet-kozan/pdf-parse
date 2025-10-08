const pdf = require('pdf-parse');
const pdf_local = require('../../../dist/cjs/index.cjs');
const ava = require('ava');
const fs = require('node:fs');
const data = fs.readFileSync('test.pdf');


const test = process.env.CI ? ava.serial : ava;


function enviroment() {
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    const isCJS = typeof require !== 'undefined' && typeof module !== 'undefined' && typeof module.exports !== 'undefined';
    const isESM = typeof window === 'undefined' && typeof require === 'undefined';

    return { isBrowser, isCJS, isESM };
}

test('pass specific options to a context', async t => {
    console.log(enviroment())
    const result = await pdf_local(data).catch((err)=>{
        console.error(err.message);
    });

    t.true(result.text.length > 100);

   




});






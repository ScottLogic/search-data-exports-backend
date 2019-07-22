const jsdom = require(`jsdom`);
const {JSDOM} = jsdom;

const fs = require('fs');

const dom = new JSDOM(`<p>WIGGLE</p>`,{ runScripts: "dangerously" });

console.log(dom.window.document);

fs.writeFile('2.html', dom.serialize(), err => {
    console.log('done');
});


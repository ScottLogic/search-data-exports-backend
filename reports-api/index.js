const AWS = require("aws-sdk");
const connectionClass = require("http-aws-es");
const ESSearch = require(`./common/search.js`);

const callbackHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};


exports.handler = function(event, context, callback) {
 
    console.log(`Event:`,event);
    console.log(`Context:`,context);
    console.log(`CallBack:`,callback);

    
};

const AWS = require("aws-sdk");
const connectionClass = require("http-aws-es");
const graphGenerator = require('./graphGenerator');

const {Client} = require('elasticsearch'); 


const callbackHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};


exports.handler = async function(event, context, callback) {

    let eventJson;
    try {
        eventJson = JSON.parse(event.body);
    } catch (error) {
        callback(null, {
            statusCode: "400",
            body: JSON.stringify({
              message: "Invalid Input JSON",
              errorMessage: error,
              content: event.body
            }),
            headers: callbackHeaders
          });
          return;
    }

    const ESConnectOptions = {
        host: process.env.ES_SEARCH_API ? process.env.ES_SEARCH_API : `https://search-sde-dev-es-test-domain-hplsrf7hatpadkuvakzrf3j7wq.eu-west-1.es.amazonaws.com`,
        //connectionClass: connectionClass,
        awsConfig: new AWS.Config({
        credentials: new AWS.EnvironmentCredentials("AWS")
        })     
    };
    const g = new graphGenerator(ESConnectOptions);    
    
    const result = await g.getReportData(eventJson).catch( error => {        
        callback(null, {
            statusCode: "400",
            body: JSON.stringify({
              message: "Error In Generation",
              errorMessage: error,
              content: event.body
            }),
            headers: callbackHeaders
          });
          return;
    });

    console.log(result);

    callback(null, {
        statusCode: "200",
        body: JSON.stringify('http://some_dud_image_url'),
        headers: callbackHeaders
    });

};

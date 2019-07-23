const AWS = require("aws-sdk");
const ConnectionClass = require("http-aws-es");
const GraphGenerator = require('./graphGenerator');

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
        host: process.env.ES_SEARCH_API ? process.env.ES_SEARCH_API : `http://localhost:9200`,
        //connectionClass: ConnectionClass,
        awsConfig: new AWS.Config({
        credentials: new AWS.EnvironmentCredentials("AWS")
        })     
    };
    const graphGenerator = new GraphGenerator(ESConnectOptions);    
    
    const result = await graphGenerator.generateGraph(eventJson).catch( error => {        
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

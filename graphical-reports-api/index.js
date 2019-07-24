const AWS = require("aws-sdk");
const connectionClass = require("http-aws-es");
const GraphGenerator = require("./graphGenerator");


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
    host: process.env.ES_SEARCH_API
      ? process.env.ES_SEARCH_API
      : `http://localhost:9200`,
    //connectionClass: connectionClass,
    awsConfig: new AWS.Config({
      credentials: new AWS.EnvironmentCredentials("AWS")
    })
  };

  const graphGenerator = new GraphGenerator(ESConnectOptions);

  const result = await graphGenerator.generateGraph(eventJson).catch(error => {
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


  callback(null, {
    statusCode: "200",
    body: JSON.stringify(result),
    headers: callbackHeaders
  });
};

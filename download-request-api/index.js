const AWS = require('aws-sdk');
const stepFunctions = new AWS.StepFunctions();

const callbackHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

exports.handler = async (event, context, callback) => {
  console.log("event.body=", event.body);

  const params = {
    stateMachineArn: process.env.CSV_DOWNLOAD_REQUEST_STEP_FUNCTION_ARN,
    input: event.body
  };

  await stepFunctions.startExecution(params).promise().then(data => {
    console.log('Step function execution response:', data);

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: callbackHeaders
    });
  }).catch(err => {
    console.log(err, err.stack);

    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error occured in step function execution',
        errorMessage: err
      }),
      headers: callbackHeaders
    });
  });
};

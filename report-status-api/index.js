const AWS = require('aws-sdk');

const stepFunctions = new AWS.StepFunctions();

const callbackHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

exports.handler = async (event, context, callback) => {
  console.log('event.body=', event.body);

  const executionArn = JSON.parse(event.body);

  await stepFunctions.describeExecution(executionArn).promise().then((data) => {
    console.log('Step function describe response:', data);

    const result = {
      status: data.status,
      // output from step function is a JSON string rather than object
      reportURL: JSON.parse(data.output).reportURL
    };

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: callbackHeaders
    });
  }).catch((err) => {
    console.error(err, err.stack);

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

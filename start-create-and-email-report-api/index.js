const AWS = require('aws-sdk');
const stepFunctions = new AWS.StepFunctions();

const callbackHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

exports.handler = async (event, context, callback) => {
  const message = event.Records[0].Sns.Message;

  const data = JSON.parse(message);

  const input = {
    emailAddress: data.parameters.emailAddress,
    searchCriteria: data.searchCriteria
  };

  const params = {
    stateMachineArn: process.env.CREATE_AND_EMAIL_REPORT_STEP_FUNCTION_ARN,
    input: JSON.stringify(input)
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

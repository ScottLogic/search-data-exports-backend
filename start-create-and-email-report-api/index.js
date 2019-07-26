const AWS = require('aws-sdk');
const stepFunctions = new AWS.StepFunctions();

exports.handler = async event => {
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

  stepFunctions.startExecution(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      console.log(data);
    }
  });
};

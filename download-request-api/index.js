const AWS = require('aws-sdk');

const stepFunctions = new AWS.StepFunctions();

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

const stepFunctionArn = process.env.CSV_DOWNLOAD_REQUEST_STEP_FUNCTION_ARN;
const activityArn = process.env.OPEN_CONNECTION_ACTIVITY_ARN;

const getTaskToken = async (type) => {
  console.log(`type=${type}`);

  if (type !== 'push') {
    return '';
  }

  const getActivityTaskParams = {
    activityArn,
    workerName: stepFunctionArn
  };

  const { taskToken } = await stepFunctions.getActivityTask(getActivityTaskParams).promise();

  return taskToken;
};

exports.handler = async (event) => {
  console.log(`event.body=${event.body}`);

  const { type } = JSON.parse(event.body);

  const startExecutionParams = {
    stateMachineArn: stepFunctionArn,
    input: event.body
  };

  const startExecutionPromise = stepFunctions.startExecution(startExecutionParams).promise();
  const taskToken = await getTaskToken(type);

  const { executionArn } = await startExecutionPromise;

  console.log(`executionArn=${executionArn}`);
  console.log(`taskToken=${taskToken}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      executionArn,
      taskToken
    }),
    headers
  };
};

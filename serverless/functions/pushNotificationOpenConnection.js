const AWS = require('aws-sdk');

const stepFunctions = new AWS.StepFunctions();

module.exports.handler = async (event) => {
  console.log(`event.body=${event.body}`);

  const { executionArn, taskToken } = JSON.parse(event.body);
  const { connectionId } = event.requestContext;
  console.log(`executionArn=${executionArn}`);
  console.log(`taskToken=${taskToken}`);
  console.log(`connectionId=${connectionId}`);

  const describeExecutionParams = {
    executionArn
  };

  const describeResponse = await stepFunctions.describeExecution(describeExecutionParams).promise();
  console.log(`describeResponse=${describeResponse}`);

  const sendTaskSuccessParams = {
    taskToken,
    output: JSON.stringify({
      socket: 'opened',
      connectionId
    })
  };

  const activityResponse = await stepFunctions.sendTaskSuccess(sendTaskSuccessParams).promise();
  console.log(`activityResponse=${activityResponse}`);

  return {
    statusCode: 200,
    body: connectionId
  };
};

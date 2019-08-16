import { StepFunctions } from 'aws-sdk';
import {
  validateRequestHeaders,
  HttpError,
  generateSuccessResponse,
  generateInternalServerErrorResponse
} from '../common/httpUtils';

const stepFunctions = new StepFunctions();

const stepFunctionArn = process.env.CSV_DOWNLOAD_REQUEST_STEP_FUNCTION_ARN;
const workerName = process.env.CSV_DOWNLOAD_REQUEST_STEP_FUNCTION_NAME;
const activityArn = process.env.OPEN_CONNECTION_ACTIVITY_ARN;

const getTaskToken = async (type) => {
  console.log(`type=${type}`);

  if (type !== 'push') {
    return '';
  }

  const getActivityTaskParams = {
    activityArn,
    workerName
  };

  const { taskToken } = await stepFunctions.getActivityTask(getActivityTaskParams).promise();

  return taskToken;
};

export async function handler(event) {
  try {
    validateRequestHeaders(event);

    const { type } = JSON.parse(event.body);
    const bodyJSON = JSON.parse(event.body);

    const startExecutionParams = {
      stateMachineArn: stepFunctionArn,
      input: JSON.stringify({
        ...bodyJSON,
        parameters: {
          ...bodyJSON.parameters,
          emailAddress: event.requestContext.authorizer.claims.email
        }
      })
    };

    const startExecutionPromise = stepFunctions.startExecution(startExecutionParams).promise();
    const taskToken = await getTaskToken(type);

    const { executionArn } = await startExecutionPromise;

    return generateSuccessResponse({ executionArn, taskToken });
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}

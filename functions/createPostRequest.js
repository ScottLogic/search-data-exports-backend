import { StepFunctions } from 'aws-sdk';
import {
  validateRequestHeaders,
  HttpError,
  generateSuccessResponse,
  generateInternalServerErrorResponse
} from '../common/httpUtils';

const stepFunctions = new StepFunctions();

const stepFunctionArn = process.env.CREATE_POST_STEP_FUNCTION_ARN;

export async function handler(event) {
  try {
    validateRequestHeaders(event);

    const UserID = event.requestContext.authorizer.claims.sub;
    const input = {
      UserID,
      ...JSON.parse(event.body)
    };

    const startExecutionParams = {
      stateMachineArn: stepFunctionArn,
      input: JSON.stringify(input)
    };

    await stepFunctions.startExecution(startExecutionParams).promise();

    return generateSuccessResponse();
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}

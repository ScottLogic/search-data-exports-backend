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

    const startExecutionParams = {
      stateMachineArn: stepFunctionArn,
      input: event.body
    };

    await stepFunctions.startExecution(startExecutionParams);

    return generateSuccessResponse();
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}

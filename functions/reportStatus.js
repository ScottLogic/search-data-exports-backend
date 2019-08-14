import { StepFunctions } from 'aws-sdk';
import {
  validateRequestHeaders,
  HttpError,
  generateSuccessResponse,
  generateInternalServerErrorResponse
} from '../common/httpUtils';

const stepFunctions = new StepFunctions();

export async function handler(event) {
  try {
    validateRequestHeaders(event);

    const executionArn = JSON.parse(event.body);

    const stepFunctionsResult = await stepFunctions.describeExecution(executionArn).promise();
    let reportURL = '';
    // output from step function is a JSON string rather than object
    if (stepFunctionsResult.output) ({ reportURL } = JSON.parse(stepFunctionsResult.output));
    return generateSuccessResponse({ status: stepFunctionsResult.status, reportURL });
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(
      `Error occured in step function execution: ${error}`
    );
  }
}

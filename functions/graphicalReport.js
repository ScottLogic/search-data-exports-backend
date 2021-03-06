import { Config, EnvironmentCredentials } from 'aws-sdk';
import connectionClass from 'http-aws-es';
import {
  validateRequestHeaders,
  HttpError,
  generateSuccessResponse,
  generateInternalServerErrorResponse
} from '../common/httpUtils';
import GraphGenerator from '../common/graphicalReport/graphGenerator';

export async function handler(event) {
  try {
    validateRequestHeaders(event);
    const eventJson = JSON.parse(event.body);

    const ESConnectOptions = {
      host: process.env.ES_SEARCH_API ? process.env.ES_SEARCH_API : 'http://localhost:9200',
      connectionClass,
      awsConfig: new Config({
        credentials: new EnvironmentCredentials('AWS')
      })
    };
    const bucketName = process.env.S3_BUCKET_NAME;

    const graphGenerator = new GraphGenerator(ESConnectOptions, bucketName);

    const result = await graphGenerator.generateGraph(eventJson);

    return generateSuccessResponse(result);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(`Error in generation: ${error}`);
  }
}

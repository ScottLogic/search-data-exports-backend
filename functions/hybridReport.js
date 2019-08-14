import { Config, EnvironmentCredentials } from 'aws-sdk';
import connectionClass from 'http-aws-es';
import {
  validateRequestHeaders,
  HttpError,
  generateSuccessResponse,
  generateInternalServerErrorResponse
} from '../common/httpUtils';
import HybridGenerator from '../common/hybridReport/hybridGenerator';

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
    const hybridGenerator = new HybridGenerator(ESConnectOptions, bucketName);

    const result = await hybridGenerator.generateReport(eventJson);
    return generateSuccessResponse(result);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(`Error in generation: ${error}`);
  }
}

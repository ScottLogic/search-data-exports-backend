import { Config, EnvironmentCredentials } from 'aws-sdk';
import ConnectionClass from 'http-aws-es';
import {
  validateRequestHeaders,
  HttpError,
  generateSuccessResponse,
  generateInternalServerErrorResponse
} from '../common/httpUtils';
import ESCreate from '../common/ESCreate';

export async function handler(event) {
  try {
    validateRequestHeaders(event);

    const UserID = event.requestContext.authorizer.claims.sub;

    const post = { ...JSON.parse(event.body), UserID };

    const ESConnectOptions = {
      host: process.env.ES_SEARCH_API ? process.env.ES_SEARCH_API : 'http://localhost:9200',
      connectionClass: ConnectionClass,
      awsConfig: new Config({
        credentials: new EnvironmentCredentials('AWS')
      })
    };
    const create = new ESCreate(ESConnectOptions);

    await create.create('posts', 'post', post);

    return generateSuccessResponse();
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}

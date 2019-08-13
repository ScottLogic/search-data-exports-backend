import { Config, EnvironmentCredentials } from 'aws-sdk';
import ConnectionClass from 'http-aws-es';
import {
  validateRequestHeaders,
  HttpError,
  generateSuccessResponse,
  generateInternalServerErrorResponse
} from '../common/httpUtils';
import ESSearch from '../common/search/search';
import formatResults from '../common/search/format';

export async function handler(event) {
  try {
    validateRequestHeaders(event);

    const eventJson = JSON.parse(event.body);
    const ESConnectOptions = {
      host: process.env.ES_SEARCH_API ? process.env.ES_SEARCH_API : 'http://localhost:9200',
      connectionClass: ConnectionClass,
      awsConfig: new Config({
        credentials: new EnvironmentCredentials('AWS')
      })
    };
    const search = new ESSearch(ESConnectOptions);

    const result = await search.search(eventJson);

    return generateSuccessResponse(formatResults(result));
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse();
  }
}

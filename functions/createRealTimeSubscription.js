import { Config, EnvironmentCredentials } from 'aws-sdk';
import { Client } from 'elasticsearch';
import connectionClass from 'http-aws-es';
import {
  validateRequestHeaders,
  HttpError,
  generateSuccessResponse,
  generateInternalServerErrorResponse
} from '../common/httpUtils';

const index = 'digests';
const type = 'digest';
const fields = ['Content', 'Tags'];

const createBody = (userID, searchQuery) => ({
  search: {
    userID,
    query: {
      multi_match: {
        query: searchQuery,
        fields
      }
    }
  }
});

export async function handler(event) {
  try {
    validateRequestHeaders(event);

    const userID = event.requestContext.authorizer.claims.sub;

    const esConnectOptions = {
      host: process.env.ES_SEARCH_API ? process.env.ES_SEARCH_API : 'http://localhost:9200',
      connectionClass,
      awsConfig: new Config({
        credentials: new EnvironmentCredentials('AWS')
      })
    };

    const client = new Client(esConnectOptions);

    const body = createBody(userID, JSON.parse(event.body));

    await client.index({
      index,
      type,
      body
    });

    return generateSuccessResponse();
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
};

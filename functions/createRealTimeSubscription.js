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

const createSearchBody = (userID, searchTerm) => ({
  query: {
    bool: {
      filter: [
        { match: { 'search.userID': userID } },
        { match: { 'search.searchTerm': searchTerm } }
      ]
    }
  }
});

const createIndexBody = (userID, searchTerm) => ({
  search: {
    userID,
    searchTerm,
    query: {
      multi_match: {
        query: searchTerm,
        fields
      }
    }
  }
});

export async function handler(event) {
  try {
    validateRequestHeaders(event);

    const esConnectOptions = {
      host: process.env.ES_SEARCH_API ? process.env.ES_SEARCH_API : 'http://localhost:9200',
      connectionClass,
      awsConfig: new Config({
        credentials: new EnvironmentCredentials('AWS')
      })
    };

    const client = new Client(esConnectOptions);

    const userID = event.requestContext.authorizer.claims.sub;
    const { value } = JSON.parse(event.body);

    const searchBody = createSearchBody(userID, value);

    const digestExists = await client.count({
      index,
      type,
      body: searchBody
    }).then(response => response.body.count > 0);

    if (digestExists) throw new HttpError('400', 'Subscription already exists');

    const indexBody = createIndexBody(userID, value);

    await client.index({
      index,
      type,
      body: indexBody
    });

    return generateSuccessResponse();
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}

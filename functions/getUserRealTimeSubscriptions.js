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

const createSearchBody = userID => ({
  query: {
    match: { 'search.userID': userID }
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

    const searchBody = createSearchBody(userID);

    const searchTerms = await client.search({
      index,
      type,
      body: searchBody
    })
      .then(response => response.hits.hits.map(hit => hit._source.search.searchTerm));

    return generateSuccessResponse(searchTerms);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse();
  }
}

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

const createDeleteBody = (userID, searchTerm) => ({
  query: {
    bool: {
      filter: [
        { match: { 'search.userID': userID } },
        { match: { 'search.searchTerm': searchTerm } }
      ]
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

    const deleteBody = createDeleteBody(userID, value);

    const totalDeleted = await client.deleteByQuery({
      index,
      type,
      body: deleteBody
    })
      .then(response => response.body.deleted);

    if (!totalDeleted) throw new HttpError(404, 'Could not find the specified subscription for user');

    return generateSuccessResponse();
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}

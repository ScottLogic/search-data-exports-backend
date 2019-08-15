import { DynamoDB } from 'aws-sdk';
import {
  validateRequestHeaders,
  HttpError,
  generateSuccessResponse,
  generateInternalServerErrorResponse
} from '../common/httpUtils';

const dynamoDbDocumentClient = new DynamoDB.DocumentClient();

const { SUBSCRIPTIONS_TABLE } = process.env;

export async function handler(event) {
  try {
    validateRequestHeaders(event);

    const userId = event.requestContext.authorizer.claims.sub;
    const { value } = JSON.parse(event.body);

    const getItemParams = {
      TableName: SUBSCRIPTIONS_TABLE,
      Key: { userId }
    };

    const { Item } = await dynamoDbDocumentClient.get(getItemParams).promise();

    if (!Item) throw new HttpError(404, 'Could not find existing subscriptions for user');

    const subscriptionIndex = Item.subscriptions.findIndex(value);

    if (subscriptionIndex === -1) throw new HttpError(404, 'Could not find specified subscription for user');

    Item.subscriptions.splice(subscriptionIndex, 1);

    const putItemParams = {
      TableName: SUBSCRIPTIONS_TABLE,
      Item
    };

    await dynamoDbDocumentClient.put(putItemParams).promise();

    return generateSuccessResponse();
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}

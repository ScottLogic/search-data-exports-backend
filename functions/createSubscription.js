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
    const { field, value } = JSON.parse(event.body);
    const getItemParams = {
      TableName: SUBSCRIPTIONS_TABLE,
      Key: { userId }
    };

    const getItemResponse = await dynamoDbDocumentClient.get(getItemParams).promise();

    let newItem;
    if (getItemResponse.Item) {
      const existingItem = getItemResponse.Item;
      for (const subscription of existingItem.subscriptions) {
        if (subscription.field === field && subscription.value === value) {
          throw new HttpError('400', 'Subscription already exists');
        }
      }
      newItem = {
        userId,
        subscriptions: [...existingItem.subscriptions, { field, value }]
      };
    } else {
      newItem = {
        userId,
        subscriptions: [{ field, value }]
      };
    }

    const putItemParams = {
      TableName: SUBSCRIPTIONS_TABLE,
      Item: newItem
    };

    await dynamoDbDocumentClient.put(putItemParams).promise();

    return generateSuccessResponse();
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}

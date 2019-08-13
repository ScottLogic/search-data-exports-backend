import { DynamoDB } from 'aws-sdk';
import {
  HttpError,
  generateSuccessResponse,
  generateInternalServerErrorResponse
} from '../common/httpUtils';

const dynamoDbDocumentClient = new DynamoDB.DocumentClient();

const { SUBSCRIPTIONS_TABLE } = process.env;

export async function handler(event) {
  try {
    const userId = event.requestContext.authorizer.claims.sub;

    const getItemParams = {
      TableName: SUBSCRIPTIONS_TABLE,
      Key: { userId }
    };

    const { Item } = await dynamoDbDocumentClient.get(getItemParams).promise();

    const subscriptions = Item ? Item.subscriptions : [];

    return generateSuccessResponse(subscriptions);
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}

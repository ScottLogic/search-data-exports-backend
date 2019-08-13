import { DynamoDB } from 'aws-sdk';
import { headers } from '../common/httpUtils';

const dynamoDbDocumentClient = new DynamoDB.DocumentClient();

const { SUBSCRIPTIONS_TABLE } = process.env;

export async function handler(event) {
  const userId = event.requestContext.authorizer.claims.sub;

  const getItemParams = {
    TableName: SUBSCRIPTIONS_TABLE,
    Key: { userId }
  };

  const { Item } = await dynamoDbDocumentClient.get(getItemParams).promise();

  const subscriptions = Item ? Item.subscriptions : [];

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(subscriptions)
  };
}

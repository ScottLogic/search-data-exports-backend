const AWS = require('aws-sdk');

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();

const { SUBSCRIPTIONS_TABLE } = process.env;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

exports.handler = async (event) => {
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
};

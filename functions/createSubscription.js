const AWS = require('aws-sdk');

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();

const { SUBSCRIPTIONS_TABLE } = process.env;

const responseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

const generateErrorResponse = (message, errorMessage, content) => ({
  statusCode: '400',
  headers: responseHeaders,
  body: JSON.stringify({
    message,
    errorMessage,
    content
  })
});

exports.handler = async (event) => {
  let eventJson;
  try {
    eventJson = JSON.parse(event.body);
  } catch (error) {
    return generateErrorResponse('Invalid Input JSON', error, event.body);
  }

  const userId = event.requestContext.authorizer.claims.sub;

  const { field, value } = eventJson;

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
        return generateErrorResponse('Subscription Already Exists', '', event.body);
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

  return {
    statusCode: 200,
    headers: responseHeaders
  };
};

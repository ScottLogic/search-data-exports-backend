const AWS = require('aws-sdk');

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();

const { SUBSCRIPTIONS_TABLE } = process.env;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

const generateErrorResponse = (statusCode, message, errorMessage, content) => ({
  statusCode,
  headers,
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

  const subscription = eventJson;

  const getItemParams = {
    TableName: SUBSCRIPTIONS_TABLE,
    Key: { userId }
  };

  const { Item } = await dynamoDbDocumentClient.get(getItemParams).promise();

  if (!Item) {
    return generateErrorResponse(404, 'Could not find subscriptions for user', '', event.body);
  }

  const subscriptionIndex = Item.subscriptions.findIndex(
    existingSubscription => existingSubscription.field === subscription.field
      && existingSubscription.value === subscription.value
  );

  if (subscriptionIndex === -1) {
    return generateErrorResponse(
      404,
      'Could not find specified subscription for user',
      '',
      event.body
    );
  }

  Item.subscriptions.splice(subscriptionIndex, 1);

  const putItemParams = {
    TableName: SUBSCRIPTIONS_TABLE,
    Item
  };

  await dynamoDbDocumentClient.put(putItemParams).promise();

  return {
    statusCode: 200,
    headers
  };
};

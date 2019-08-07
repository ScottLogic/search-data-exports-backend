const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB();
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

  const { emailAddress, type, searchText } = eventJson;

  const newSubscription = { type, searchText };

  const getItemParams = {
    TableName: SUBSCRIPTIONS_TABLE,
    Key: { emailAddress }
  };

  const getItemResponse = await dynamoDb.getItem(getItemParams).promise();

  let newItem;
  if (getItemResponse.Item) {
    const existingItem = getItemResponse.Item;
    for (const subscription of existingItem.subscriptions) {
      if (
        subscription.searchText === newSubscription.searchText &&
        subscription.type === newSubscription.type
      ) {
        return generateErrorResponse('Subscription Already Exists', '', event.body);
      }
    }
    newItem = {
      emailAddress,
      subscriptions: [...existingItem.subscriptions, newSubscription]
    };
  } else {
    newItem = {
      emailAddress,
      subscriptions: [newSubscription]
    };
  }

  const putItemParams = {
    TableName: SUBSCRIPTIONS_TABLE,
    Item: newItem
  };

  await dynamoDb.putItem(putItemParams).promise();

  return {
    statusCode: 200,
    headers: responseHeaders
  };
};

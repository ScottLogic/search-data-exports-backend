const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
  console.log(`event\n${JSON.stringify(event, null, 2)}`);

  const { reportURL } = event[0];
  const { connectionId } = event[1];

  console.log(`reportURL=${reportURL}`);
  console.log(`connectionId=${connectionId}`);

  const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: process.env.WEBSOCKET_ENDPOINT_URL
  });

  await apiGatewayManagementApi.postToConnection({
    ConnectionId: connectionId,
    Data: JSON.stringify({ message: 'Hello World' })
  }).promise;

  return event;
};

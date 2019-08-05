const fs = require('fs');

function handler(data) {
  fs.mkdirSync('./env');

  const restApiUrl = { REACT_APP_API_URL: data.ServiceEndpoint };
  fs.writeFileSync('./envs/update_rest_api_url.json', JSON.stringify(restApiUrl));

  const webSocketUrl = { REACT_APP_WEBSOCKET_ENDPOINT: data.ServiceEndpointWebsocket };
  fs.writeFileSync('./envs/update_websocket_url.json', JSON.stringify(webSocketUrl));
}

module.exports = { handler };

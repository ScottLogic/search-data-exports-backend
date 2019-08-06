const fs = require('fs');

function getNameValuePair(envVariableName, envVariableValue) {
  return {
    name: envVariableName,
    value: envVariableValue
  };
}

function handler(data) {
  if (!fs.existsSync('./env')) fs.mkdirSync('./env');

  const restApiUrlEnv = getNameValuePair('REACT_APP_API_URL', data.ServiceEndpoint);
  fs.writeFileSync('./env/update_rest_api_url.json', JSON.stringify(restApiUrlEnv));

  const webSocketUrlEnv = getNameValuePair('REACT_APP_WEBSOCKET_ENDPOINT', data.ServiceEndpointWebsocket);
  fs.writeFileSync('./env/update_websocket_url.json', JSON.stringify(webSocketUrlEnv));
}

module.exports = { handler };

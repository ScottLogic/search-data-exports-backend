const AWS = require('aws-sdk');
const ConnectionClass = require('http-aws-es');
const ESCreate = require('../common/ESCreate');

const callbackHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

exports.handler = (event, _, callback) => {
  let eventJson;
  try {
    eventJson = JSON.parse(event.body);
  } catch (error) {
    callback(null, {
      statusCode: '400',
      body: JSON.stringify({
        message: 'Invalid Input JSON',
        errorMessage: error,
        content: event.body
      }),
      headers: callbackHeaders
    });
    return;
  }

  const ESConnectOptions = {
    host: process.env.ES_SEARCH_API ? process.env.ES_SEARCH_API : 'http://localhost:9200',
    connectionClass: ConnectionClass,
    awsConfig: new AWS.Config({
      credentials: new AWS.EnvironmentCredentials('AWS')
    })
  };
  const create = new ESCreate(ESConnectOptions);

  create
    .create('posts', 'post', eventJson)
    .then((result) => {
      callback(null, {
        statusCode: '200',
        body: JSON.stringify({ status: result.result }),
        headers: callbackHeaders
      });
    })
    .catch((error) => {
      callback(null, {
        statusCode: '500',
        body: JSON.stringify({ message: 'New Post Error', errorMessage: error }),
        headers: callbackHeaders
      });
    });
};

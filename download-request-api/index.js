const AWS = require("aws-sdk");

const callbackHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

exports.handler = function(event, _, callback) {
  let eventJson;
  try {
    eventJson = JSON.parse(event.body);
  } catch (error) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid Input JSON",
        errorMessage: error,
        content: event.body
      }),
      headers: callbackHeaders
    });
    return;
  }

  const expectedProperties = ["type", "parameters", "searchCriteria"];

  // Number of JSON keys validation
  const numJsonProperties = Object.keys(eventJson).length;
  const numExpectedProperties = expectedProperties.length;
  if (numJsonProperties !== numExpectedProperties) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: "Expected JSON properties count mismatch",
        errorMessage:
          "Expected " +
          numExpectedProperties +
          " properties but got " +
          numJsonProperties,
        content: event.body
      }),
      headers: callbackHeaders
    });
    return;
  }

  // Expected JSON keys validation
  for (let expectedProperty of expectedProperties) {
    if (!eventJson.hasOwnProperty(expectedProperty)) {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required JSON property",
          errorMessage:
            'Missing required JSON property "' + expectedProperty + '"',
          content: event.body
        }),
        headers: callbackHeaders
      });
      return;
    }
  }

  const sns = new AWS.SNS();
  const publishParams = {
    Message: JSON.stringify(eventJson),
    Subject: "download-request",
    TopicArn: process.env.DOWNLOAD_REQUESTS_SNS_TOPIC
  };
  sns.publish(publishParams).promise().then(data => {
      console.log("published message to topic");
      console.log(data);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: callbackHeaders
      });
    })
    .catch(error => {
      console.error(error, error.stack);
      callback(null, {
        statusCode: "500",
        body: JSON.stringify({
          message: "Download Request Error",
          errorMessage: error
        }),
        headers: callbackHeaders
      });
    });
};

const AWS = require('aws-sdk');
const ses = new AWS.SES();
const { EMAIL_SENDER_ADDRESS } = process.env;

exports.handler = async event => {

  console.log("EVENT\n" + JSON.stringify(event, null, 2));
  
  const result = await sendEmail(event.email);

  console.log('Sent email successfully', result);

  return result;
};

function sendEmail(email) {
  var params = {
    Destination: {
        ToAddresses: email.to,
    },
    Message: {
        Body: {
            Html: {
                Data: email.htmlBody || email.textBody,
            },
            Text: {
                Data: email.textBody || email.htmlBody,
            }

        },
        Subject: {
            Data: email.subject
        }
    },
    Source: EMAIL_SENDER_ADDRESS,
  };

  return ses.sendEmail(params).promise();
}


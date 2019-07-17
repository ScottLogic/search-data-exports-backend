const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'eu-west-1' });

async function sendEmail(toAddress, filename) {

  var eParams = {
    Destination: {
        ToAddresses: [toAddress]
    },
    Message: {
        Body: {
            Text: {
                Data: "Your report:" + filename
            },
            Html: {
                Data: '<html><head><title>Your report</title></head><body><a href="' + filename + '">Download report</a><body></html>'
            }

        },
        Subject: {
            Data: "Email Subject!!!"
        }
    },
    Source: toAddress
  };

  console.log("sending email - eParams=" + JSON.stringify(eParams, null, 2));

  var sendPromise = ses.sendEmail(eParams).promise();

  return sendPromise.then(
    function(data) {
      console.log("email MessageId=" + data.MessageId);
    }).catch(
      function(err) {
        console.error(err, err.stack);
        throw err;
    }
  );

}

module.exports = sendEmail;

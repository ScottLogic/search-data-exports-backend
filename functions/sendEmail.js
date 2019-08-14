import { SES } from 'aws-sdk';

const ses = new SES();
const { EMAIL_SENDER_ADDRESS } = process.env;

function sendEmail(email) {
  const htmlBody = `<html><head><title>Your report</title></head><body><a href="${email.reportURL}">Download report</a><body></html>`;

  const params = {
    Destination: {
      ToAddresses: [email.to]
    },
    Message: {
      Body: {
        Html: {
          Data: htmlBody
        }
      },
      Subject: {
        Data: email.subject
      }
    },
    Source: EMAIL_SENDER_ADDRESS
  };

  return ses.sendEmail(params).promise();
}

export async function handler(event) {
  const result = await sendEmail(event.email);
  return result;
}

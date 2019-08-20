import { SES, CognitoIdentityServiceProvider } from 'aws-sdk';
import createHtmlBody from '../common/digestEmailHtml';

const ses = new SES();
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const { EMAIL_SENDER_ADDRESS, USER_POOL_ID } = process.env;

export async function handler(event) {
  const cognitoParams = {
    UserPoolId: USER_POOL_ID,
    Username: event.userID
  };

  const { UserAttributes } = (
    await cognitoIdentityServiceProvider.adminGetUser(cognitoParams).promise()
  );
  const emailAttribute = UserAttributes.find(attr => attr.Name === 'email');
  const email = emailAttribute.Value;

  const params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Data: createHtmlBody(event.results)
        }
      },
      Subject: {
        Data: 'Helixer Search Digest'
      }
    },
    Source: EMAIL_SENDER_ADDRESS
  };

  await ses.sendEmail(params).promise();
}

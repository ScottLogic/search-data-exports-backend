import { SES, CognitoIdentityServiceProvider } from 'aws-sdk';

const ses = new SES();
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const { EMAIL_SENDER_ADDRESS, USER_POOL_ID } = process.env;

const createDigestSection = result => (
  `<h3>New posts matching your digests for <i>${result.searchTerms.join(', ')}</i>:</h3>
  ${result.posts.map(post => (
    `<div style="background-color: whitesmoke; border: 1px solid black;">
      <div>
        <div>${post.UserID}</div>
        <div>${post.DateCreated}</div>
      </div>
      <hr>
      <div>
        ${post.Content}
      </div>
      <div>
        ${post.Tags.join(' ')}
      </div>
    </div>`
  ))}`
);

const createHtmlBody = results => (
  `<html>
    <head>
      <title>Your digest</title>
    </head>
    <body>
      ${results.map(result => createDigestSection(result))}
    </body>
  </html>`
);

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

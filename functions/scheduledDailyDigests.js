import { DynamoDB, Lambda } from 'aws-sdk';

const dynamoDbDocumentClient = new DynamoDB.DocumentClient();
const lambda = new Lambda();

const { SUBSCRIPTIONS_TABLE: TableName, USER_DIGEST_LAMBDA_NAME: FunctionName } = process.env;

export const handler = async () => {
  const scanParams = { TableName };
  const { Items } = await dynamoDbDocumentClient.scan(scanParams).promise();
  await Promise.all(
    Items.filter(userSubscriptions => userSubscriptions.subscriptions.length).map(
      async userSubscriptions => lambda
        .invoke({
          FunctionName,
          InvocationType: 'Event',
          Payload: JSON.stringify(userSubscriptions)
        }).promise()
    )
  );
};

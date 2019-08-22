import { DynamoDB, Lambda } from 'aws-sdk';

export const handler = async () => {
  const { SUBSCRIPTIONS_TABLE: TableName, USER_DIGEST_LAMBDA_NAME: FunctionName } = process.env;
  const dynamoDbDocumentClient = new DynamoDB.DocumentClient();
  const lambda = new Lambda();

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

import { DynamoDB, Config, EnvironmentCredentials } from 'aws-sdk';
import ConnectionClass from 'http-aws-es';
import ESSearch from '../common/search/search';

const dynamoDbDocumentClient = new DynamoDB.DocumentClient();

const { SUBSCRIPTIONS_TABLE, ES_SEARCH_API } = process.env;

const ESConnectOptions = {
  host: ES_SEARCH_API,
  connectionClass: ConnectionClass,
  awsConfig: new Config({
    credentials: new EnvironmentCredentials('AWS')
  })
};

const search = new ESSearch(ESConnectOptions);

async function processSubscription(subscription) {
    console.log(`Processing subscriptions: ${subscription.userId}`);
}

async function processUserSubscriptions(userSubscriptions) {
  console.log(`Processing subscriptions of user with ID: ${userSubscriptions.userId}`);
}

export async function handler() {
  const scanParams = {
    TableName: SUBSCRIPTIONS_TABLE
  };

  const { Items } = await dynamoDbDocumentClient.scan(scanParams).promise();

  await Promise.all(Items.map(async userSubscriptions => processUserSubscriptions(userSubscriptions)));
}

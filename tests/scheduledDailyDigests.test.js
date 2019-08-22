import { DynamoDB, Lambda } from 'aws-sdk';
import { handler } from '../functions/scheduledDailyDigests';

jest.mock('aws-sdk');

const subscriptionsTableData = {
  Items: [
    { userId: 1, subscriptions: [] },
    { userId: 2, subscriptions: ['test'] },
    { userId: 3, subscriptions: ['test1', 'test2'] }
  ]
};

const mockDynamoDbScan = {
  promise: jest.fn()
};

const mockLambdaInvoke = {
  promise: jest.fn()
};

DynamoDB.DocumentClient.mockImplementation(() => ({ scan: () => mockDynamoDbScan }));

Lambda.mockImplementation(() => ({ invoke: () => mockLambdaInvoke }));

describe('scheduledDailyDigests function', () => {
  beforeAll(() => {
    process.env = Object.assign(process.env, {
      SUBSCRIPTIONS_TABLE: 'subscriptions',
      USER_DIGEST_LAMBDA_NAME: 'calculateUserDailyDigest'
    });
  });

  it('invokes calculateUserDailyDigest for each user with at least one subscription', async () => {
    mockDynamoDbScan.promise.mockResolvedValue(subscriptionsTableData);
    mockLambdaInvoke.promise.mockResolvedValue();
    await handler();
    expect(mockLambdaInvoke.promise).toHaveBeenCalledTimes(2);
  });
});

import ESSearch from '../common/search/search';
import { exportedFunctions } from '../functions/calculateUserDailyDigest';

const esSearchResult = require('./test_data/esSearchResult');
const lambdaResult = require('./test_data/lambdaResult');

jest.mock('aws-sdk');
jest.mock('http-aws-es');
jest.mock('../common/search/search');
jest.mock('../common/query');

const handlerInput = {
  userId: 1,
  subscriptions: ['test', 'math']
};

describe('calculateUserDailyDigest function', () => {
  beforeAll(() => {
    process.env = Object.assign(process.env, {
      ES_SEARCH_API: 'elasticsearch/api',
      EMAIL_MAX_POSTS: 100,
      SEND_DIGEST_EMAIL_LAMBDA_NAME: 'sendDigestEmail'
    });
  });

  it('invokes calculateUserDailyDigest for each user with at least one subscription', async () => {
    ESSearch.mockImplementation(() => ({
      doMultiSearch: jest.fn().mockReturnValue(esSearchResult)
    }));

    exportedFunctions.sendDailyDigestEmail = jest.fn();

    await exportedFunctions.handler(handlerInput);
    expect(exportedFunctions.sendDailyDigestEmail).toBeCalledWith(lambdaResult, expect.anything(), expect.anything());
  });
});

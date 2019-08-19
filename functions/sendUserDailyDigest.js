import { Config, EnvironmentCredentials } from 'aws-sdk';
import ConnectionClass from 'http-aws-es';
import ESSearch from '../common/search/search';
import buildQueryJson from '../common/query';

const { ES_SEARCH_API, EMAIL_MAX_POSTS } = process.env;

const ESConnectOptions = {
  host: ES_SEARCH_API,
  connectionClass: ConnectionClass,
  awsConfig: new Config({
    credentials: new EnvironmentCredentials('AWS')
  })
};

const esSearchClient = new ESSearch(ESConnectOptions);

// Midnight yesterday
const getDateBegin = () => {
  const dateBegin = new Date();
  dateBegin.setDate(dateBegin.getDate() - 1);
  dateBegin.setHours(0, 0, 0, 0);
  return dateBegin;
};

// Midnight today
const getDateEnd = () => {
  const dateEnd = new Date();
  dateEnd.setHours(0, 0, 0, 0);
  return dateEnd;
};

/*
  Receives the user subscriptions array and transforms it into
  a powerset (all possible subset combinations), except from the empty set.
  Returns an array of arrays sorted by array length descending.
*/
const getSubscriptionCombinations = subscriptions => subscriptions
  .reduce(
    (combinations, subscription) => combinations.concat(combinations.map(
      set => [subscription, ...set]
    )),
    [[]]
  )
  .filter(set => set.length)
  .sort((a, b) => b.length - a.length);

const formatInputQueryBody = (combinations, dateBegin, dateEnd) => combinations
  .map(combination => combination.reduce(
    (acc, value) => {
      acc.search = [...acc.search, { value }];
      return acc;
    },
    {
      type: 'post',
      search: [{ dateRange: [dateBegin, dateEnd] }]
    }
  ));

// Not implemented yet
const trimDigest = results => results;

/*
  Parses multisearch result and outputs an object specifying the user and the digest
  sections to be sent via email. Ensures that posts occuring in multiple digest sections
  are only included once.
*/
const transformMultiSearchResult = (userId, subscriptionCombinations, mSearchResult) => {
  const searchHits = mSearchResult.responses.map(response => response.hits.hits.map(hit => ({
    PostId: hit._id,
    ...hit._source
  })));

  const result = { userId, results: [] };

  const includedPostIds = new Set();

  let totalCount = 0;

  for (let i = 0; i < subscriptionCombinations.length; i += 1) {
    if (searchHits[i].length) {
      const uniquePosts = searchHits[i].filter(hit => !includedPostIds.has(hit.PostId));
      if (uniquePosts.length) {
        uniquePosts.forEach(post => includedPostIds.add(post.PostId));
        result.results.push({
          searchTerms: subscriptionCombinations[i],
          posts: uniquePosts
        });
        totalCount += uniquePosts.length;
      }
    }
  }
  if (totalCount > EMAIL_MAX_POSTS) result.results = trimDigest(result.results, totalCount);
  return result;
};

const sendDailyDigestEmail = (result) => {
  // Not implemented yet
  console.log(JSON.stringify(result));
};

const processUserSubscriptions = async (userId, subscriptions) => {
  console.log(`Processing ${subscriptions.length} subscriptions of user with ID: ${userId}`);
  if (!subscriptions.length) return;

  const subscriptionCombinations = getSubscriptionCombinations(subscriptions);
  const buildQueryInput = formatInputQueryBody(
    subscriptionCombinations,
    getDateBegin(),
    getDateEnd()
  );

  const body = [];
  for (const input of buildQueryInput) {
    body.push({ index: 'posts', type: 'post' });
    body.push(buildQueryJson(input, undefined, 10000));
  }
  const msearchInput = { body };

  const mSearchResult = await esSearchClient.doMultiSearch(msearchInput);
  const result = transformMultiSearchResult(userId, subscriptionCombinations, mSearchResult);

  sendDailyDigestEmail(result);
};

export const handler = async (event) => {
  const { userId, subscriptions } = event;
  await processUserSubscriptions(userId, subscriptions);
};

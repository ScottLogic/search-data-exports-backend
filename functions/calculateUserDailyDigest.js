import { Config, EnvironmentCredentials, Lambda } from 'aws-sdk';
import ConnectionClass from 'http-aws-es';
import ESSearch from '../common/search/search';
import buildQueryJson from '../common/query';

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

const formatInputQueryBody = (subscriptions, dateBegin, dateEnd) => subscriptions.map(value => ({
  type: 'post',
  search: [{ value }, { dateRange: [dateBegin, dateEnd] }]
}));

const trimDigest = (results, maxPosts) => {
  const digestSections = results.length;
  let postPool = digestSections >= maxPosts ? 0 : maxPosts - digestSections;

  const newResults = [];

  for (const entry of results) {
    let postsToCopy = 1;
    if (postPool > 0) {
      postsToCopy = entry.posts.length - 1 <= postPool ? entry.posts.length : postPool + 1;
      postPool -= postsToCopy - 1;
    }

    newResults.push({
      searchTerms: entry.searchTerms,
      posts: entry.posts.slice(0, postsToCopy)
    });
  }

  return newResults;
};

const compareSortedArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i += 1) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

const transformMultiSearchResult = (userID, subscriptions, mSearchResult, EMAIL_MAX_POSTS) => {
  const searchHits = mSearchResult.responses
    .map(response => response.hits.hits.map(hit => ({
      PostId: hit._id,
      ...hit._source
    })));

  const mapPostIdsToPosts = new Map();

  searchHits.forEach(searchHit => searchHit
    .forEach(post => mapPostIdsToPosts.set(post.PostId, post)));

  const mapPostsToSearches = new Map();

  for (let i = 0; i < subscriptions.length; i += 1) {
    // eslint-disable-next-line no-loop-func
    searchHits[i].forEach((post) => {
      if (mapPostsToSearches.has(post.PostId)) {
        mapPostsToSearches.get(post.PostId).add(subscriptions[i].toLowerCase());
      } else {
        mapPostsToSearches.set(post.PostId, new Set([subscriptions[i].toLowerCase()]));
      }
    });
  }

  let results = [];
  let totalPostsCount = 0;

  for (const entry of mapPostsToSearches.entries()) {
    const postId = entry[0];
    const searchTerms = Array.from(entry[1].values());
    searchTerms.sort();

    let added = false;
    for (const digest of results) {
      if (compareSortedArrays(digest.searchTerms, searchTerms)) {
        digest.posts.push(mapPostIdsToPosts.get(postId));
        added = true;
        break;
      }
    }
    if (!added) results.push({ searchTerms, posts: [mapPostIdsToPosts.get(postId)] });
    totalPostsCount += 1;
  }

  results.sort((a, b) => b.searchTerms.length - a.searchTerms.length);

  if (totalPostsCount > EMAIL_MAX_POSTS) results = trimDigest(results, EMAIL_MAX_POSTS);

  return { userID, results };
};

const sendDailyDigestEmail = async (result, FunctionName, lambda) => lambda
  .invoke({
    FunctionName,
    InvocationType: 'Event',
    Payload: JSON.stringify(result)
  })
  .promise();

const processUserSubscriptions = async (
  userID,
  subscriptions,
  EMAIL_MAX_POSTS,
  FunctionName,
  esSearchClient,
  lambda
) => {
  console.log(`Processing ${subscriptions.length} subscriptions of user with ID: ${userID}`);

  const buildQueryInput = formatInputQueryBody(subscriptions, getDateBegin(), getDateEnd());

  const body = [];
  for (const input of buildQueryInput) {
    body.push({ index: 'posts', type: 'post' });
    body.push(buildQueryJson(input, undefined, 10000));
  }
  const mSearchInput = { body };

  const mSearchResult = await esSearchClient.doMultiSearch(mSearchInput);

  const result = transformMultiSearchResult(userID, subscriptions, mSearchResult, EMAIL_MAX_POSTS);
  if (result.results.length) {
    // eslint-disable-next-line no-use-before-define
    await exportedFunctions.sendDailyDigestEmail(result, FunctionName, lambda);
    console.log(`Sent ${result.results.length} digest updates to user ${userID}`);
  }
};

const handler = async (event) => {
  const {
    ES_SEARCH_API,
    EMAIL_MAX_POSTS,
    SEND_DIGEST_EMAIL_LAMBDA_NAME: FunctionName
  } = process.env;
  const esSearchClient = new ESSearch({
    host: ES_SEARCH_API,
    connectionClass: ConnectionClass,
    awsConfig: new Config({
      credentials: new EnvironmentCredentials('AWS')
    })
  });
  const lambda = new Lambda();

  const { userId: userID, subscriptions } = event;
  await processUserSubscriptions(
    userID,
    subscriptions,
    EMAIL_MAX_POSTS,
    FunctionName,
    esSearchClient,
    lambda
  );
};

export const exportedFunctions = {
  handler,
  sendDailyDigestEmail
};

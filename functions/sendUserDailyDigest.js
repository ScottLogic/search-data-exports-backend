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

const formatInputQueryBody = (subscriptions, dateBegin, dateEnd) => subscriptions.map(value => ({
  type: 'post',
  search: [{ value }, { dateRange: [dateBegin, dateEnd] }]
}));

// Not implemented yet
const trimDigest = results => results;

const compareSortedArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i += 1) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

const transformMultiSearchResult = (userId, subscriptions, mSearchResult) => {
  const searchHits = mSearchResult.responses
    .filter(response => response.hits.hits.length)
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
        mapPostsToSearches.get(post.PostId).add(subscriptions[i]);
      } else {
        mapPostsToSearches.set(post.PostId, new Set([subscriptions[i]]));
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

  if (totalPostsCount > EMAIL_MAX_POSTS) results = trimDigest(results);

  return { userId, results };
};

const sendDailyDigestEmail = (result) => {
  // Not implemented yet
  console.log(JSON.stringify(result, null, 2));
};

const processUserSubscriptions = async (userId, subscriptions) => {
  console.log(`Processing ${subscriptions.length} subscriptions of user with ID: ${userId}`);

  if (!subscriptions.length) return;

  const buildQueryInput = formatInputQueryBody(
    subscriptions,
    getDateBegin(),
    getDateEnd()
  );

  const body = [];
  for (const input of buildQueryInput) {
    body.push({ index: 'posts', type: 'post' });
    body.push(buildQueryJson(input, undefined, 10000));
  }
  const mSearchInput = { body };

  const mSearchResult = await esSearchClient.doMultiSearch(mSearchInput);

  const result = transformMultiSearchResult(userId, subscriptions, mSearchResult);

  sendDailyDigestEmail(result);
};

export const handler = async (event) => {
  const { userId, subscriptions } = event;
  await processUserSubscriptions(userId, subscriptions);
};

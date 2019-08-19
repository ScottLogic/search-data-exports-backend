import { Config, EnvironmentCredentials } from 'aws-sdk';
import { Client } from 'elasticsearch';
import connectionClass from 'http-aws-es';
import {
  HttpError,
  generateInternalServerErrorResponse
} from '../common/httpUtils';

const index = 'digests';
const type = 'digest';
// Elasticsearch requires a size limit for aggregations from 1 to 2147483647
// Higher limits are more CPU and memory intensive and can potentially destabilise a cluster
// https://github.com/elastic/elasticsearch/issues/18838
const idAggMaxSize = 1000000;
const searchTermAggMaxSize = 1000000;

const createAggregations = () => ({
  userIDs: {
    terms: {
      field: 'search.userID',
      size: idAggMaxSize
    },
    aggs: {
      searchTerms: {
        terms: {
          field: 'search.searchTerm.keyword',
          size: searchTermAggMaxSize
        }
      }
    }
  }
});

const createQuery = (Content, Tags) => ({
  bool: {
    filter: [
      {
        percolate: {
          field: 'search.query',
          document: {
            Content,
            Tags
          }
        }
      }
    ]
  }
});

const createSearchBody = (Content, Tags) => ({
  size: 0,
  aggs: createAggregations(),
  query: createQuery(Content, Tags)
});

const buildEmailData = async (entry, post) => ({
  userID: entry.key,
  results: [
    {
      searchTerms: entry.searchTerms.buckets.map(searchTerm => searchTerm.key),
      posts: [post]
    }
  ]
});

export async function handler(event) {
  try {
    const esConnectOptions = {
      host: process.env.ES_SEARCH_API ? process.env.ES_SEARCH_API : 'http://localhost:9200',
      connectionClass,
      awsConfig: new Config({
        credentials: new EnvironmentCredentials('AWS')
      })
    };

    const client = new Client(esConnectOptions);

    const searchBody = createSearchBody(event.Content, event.Tags);

    const emailData = await client.search({
      index,
      type,
      body: searchBody
    })
      .then(response => (
        Promise.all(response.aggregations.userIDs.buckets.map(async entry => (
          buildEmailData(entry, event)))
        )
      ));

    return { emailData };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}

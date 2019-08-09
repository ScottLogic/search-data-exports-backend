const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.sde-dev-elasticsearch-endpoint });

const ES_INDEX = 'digests';
const ES_TYPE = 'digest';

const createIndex = async () => {
  const indexExists = await client.indices.exists({ index: 'digests' });

  if (!indexExists.body) {
    await client.indices.create({
      index: ES_INDEX,
      body: createBody()
    });
  }
};

const createBody = () => ({
  mappings: {
    [ES_TYPE]: {
      properties: {
        search: {
          properties: {
            query: { type: 'percolator' },
            userID: { type: 'text' }
          }
        },
        Content: { type: 'text' },
        Tags: { type: 'text' }
      }
    }
  }
});

createIndex().catch(console.log);

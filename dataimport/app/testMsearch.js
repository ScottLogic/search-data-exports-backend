const { Client } = require('@elastic/elasticsearch');
const buildQueryJson = require('../../common/search/query.js');

const lambdaInput = [
  {
    field: 'all',
    value: 'person'
  },
  {
    field: 'all',
    value: 'test'
  },
  {
    field: 'all',
    value: 'old'
  }
];

const mSearch = async () => {
  const client = new Client({
    node:
      'https://search-sde-dev-es-test-domain-hplsrf7hatpadkuvakzrf3j7wq.eu-west-1.es.amazonaws.com'
  });



  const dateBegin = new Date();
  dateBegin.setDate(dateBegin.getDate() - 1);
  dateBegin.setHours(0, 0, 0, 0);

  const dateEnd = new Date();
  dateEnd.setHours(0, 0, 0, 0);

  const buildQueryInput = lambdaInput.map((sub) => ({
    type: 'post',
    search: [sub, {dateRange: [dateBegin, dateEnd]}]
  }));

  const queryBody = [];

  for (const input of buildQueryInput) {
    queryBody.push({ index: 'posts', type: 'post' });
    queryBody.push(buildQueryJson(input));
  }

  const msearchInput = { body: queryBody };

  const mSearchResult = await client.msearch(msearchInput);

  mSearchResult.body.responses.map((response) => console.log(response.hits.hits));
  
};

mSearch();

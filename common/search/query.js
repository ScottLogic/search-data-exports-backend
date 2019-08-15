/* This code is responsible to making ES queries from the JSON inputted,
as we want to hide some of the nitty gritty from the users. */
const SEARCH_FIELDS_USER = ['LastName', 'FirstName', 'EmailAddress'];
const SEARCH_FIELDS_POST = ['Content', 'Tags^3']; // The ^3 makes tags 3 times more important that content.

const buildFilters = (type, dateRange = []) => {
  const filterList = [];
  if (type) filterList.push({ term: { _type: type } });
  if (dateRange.length >= 1) filterList.push({ range: { DateCreated: { gte: dateRange[0] } } });
  if (dateRange.length >= 2) filterList.push({ range: { DateCreated: { lt: dateRange[1] } } });
  return filterList;
};

const makeTermQuery = (field, value) => ({
  match: { [`${field}`]: value }
});

const getFieldList = (type) => {
  switch (type) {
    case 'post':
      return SEARCH_FIELDS_POST;
    case 'user':
      return SEARCH_FIELDS_USER;
    default:
      return [...SEARCH_FIELDS_POST, ...SEARCH_FIELDS_USER];
  }
};

const makeMultiFieldQuery = (type, queryData) => ({
  multi_match: {
    query: queryData,
    fields: getFieldList(type)
  }
});

const buildQuery = (type, searchFilters) => {
  const queryList = [];
  for (const filter of searchFilters) {
    switch (filter.field) {
      case 'all':
        queryList.push(makeMultiFieldQuery(type, filter.value));
        break;
      default:
        queryList.push(makeTermQuery(filter.field, filter.value));
    }
  }
  return queryList;
};

const buildQueryJson = (rawRequest = {}, method, resultsSize = 10) => {
  /* The only filters we care about are type, and dateRange.
       Everything else is actual scored filters. */
  const dateRange = rawRequest.search.find(x => x.dateRange);
  const filtersList = buildFilters(method || rawRequest.type, dateRange ? dateRange.dateRange : []);
  const queryList = buildQuery(
    method || rawRequest.type,
    rawRequest.search.filter(x => !x.dateRange)
  );

  return {
    query: {
      bool: {
        must: queryList,
        filter: filtersList
      }
    },
    size: resultsSize,
    from: rawRequest.page ? rawRequest.page * resultsSize : 0
  };
};

module.exports = buildQueryJson;

/* This code is responsible to making ES queries from the JSON inputted,
as we want to hide some of the nitty gritty from the users. */
const { Client } = require('elasticsearch');
const buildQueryJson = require('../query.js');

const buildRequestJSON = (searchJSON, method) => ({
  body: searchJSON,
  index: method
});

class ESSearch {
  constructor(ESConnectOptions = {}) {
    this._connectionOptions = ESConnectOptions;
    this._client = new Client(ESConnectOptions);
  }

  async doMultiSearch(searchJSON) {
    return this._client.msearch(searchJSON);
  }

  // Actually perform the search to the Elastic Search
  async doSearch(searchJSON) {
    return this._client.search(searchJSON);
  }

  async search(requestJSON) {
    return this.doSearch(buildRequestJSON(buildQueryJson(requestJSON)));
  }
}

module.exports = ESSearch;

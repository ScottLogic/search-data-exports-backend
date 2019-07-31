/* This code is responsible to making ES queries from the JSON inputted, as we want to hide some
 of the nitty gritty from the users. */
const { Client } = require('elasticsearch');

class ESSearch {
  constructor(ESConnectOptions = {}) {
    this._client = new Client(ESConnectOptions);
  }

  // Search the Elastic Search on the given JSON.
  async search(requestJSON) {    
    return this._client.search(requestJSON);
  }
}

module.exports = ESSearch;

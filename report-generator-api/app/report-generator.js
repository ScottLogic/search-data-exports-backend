const AWS = require('aws-sdk');
const connectionClass = require('http-aws-es');
const { Client } = require('elasticsearch');
const QueryGenerator = require('./query.js');
const Formatter = require('./csv-formatter');

// this should be much higher number (10000), but set low to demonstrate scroll / multi-part upload
const scrollResultSize = 10;

const getConfig = () => ({
  host: process.env.ES_SEARCH_API,
  connectionClass,
  awsConfig: new AWS.Config({
    credentials: new AWS.EnvironmentCredentials('AWS')
  })
});

const buildSearchJSON = searchJSON => ({
  scroll: '10s',
  body: searchJSON
});

class ReportGenerator {
  constructor(outputFile) {
    this._queryGenerator = new QueryGenerator();
    this._client = new Client(getConfig());
    this._outputFile = outputFile;
  }

  async doSearch(searchJSON) {
    console.log(`searchJSON = ${JSON.stringify(searchJSON, null, 2)}`);
    return this._client.search(searchJSON);
  }

  async doScroll(scrollId) {
    return this._client.scroll({
      scroll: '10s',
      scrollId
    });
  }

  emitHeader(header) {
    this._outputFile.append(header);
  }

  emitRows(rows) {
    this._outputFile.append(rows);
  }

  async emitComplete() {
    return this._outputFile.close();
  }

  async processBatch(result) {
    let { hits } = result.hits;
    let currentScrollId = result._scroll_id;

    while (hits && hits.hits.length) {
      this.emitRows(Formatter.formatRows(result));

      const scrollResult = await this.doScroll(currentScrollId);

      ({ hits } = scrollResult);
      currentScrollId = scrollResult._scroll_id;
    }
  }

  async runReport(requestJSON) {
    const searchJSON = buildSearchJSON(
      this._queryGenerator.buildQueryJson(requestJSON, null, scrollResultSize)
    );

    const searchResult = await this.doSearch(searchJSON);

    this.emitHeader(Formatter.formatHeader(searchResult));

    await this.processBatch(searchResult);

    const reportURI = await this.emitComplete();

    console.log(`runReport complete, reportURI=${reportURI}`);

    return reportURI;
  }

  async generate(requestJSON) {
    return this.runReport(requestJSON);
  }
}

module.exports = ReportGenerator;

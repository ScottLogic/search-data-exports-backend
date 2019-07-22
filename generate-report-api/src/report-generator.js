const QueryGenerator = require('./query.js');
const {Client} = require('elasticsearch');

// this should be much higher number (10000), but set low to demonstrate scroll / multi-part upload
const scrollResultSize = 10;

class ReportGenerator {

  constructor( configOptions = {}, formatter, outputFile ) {
    this._queryGenerator = new QueryGenerator();
    this._configOptions = configOptions;
    this._client = new Client( configOptions );
    this._formatter = formatter;
    this._outputFile = outputFile;
  }

  async doSearch( searchJSON ) {
    console.log('searchJSON = ' +  JSON.stringify(searchJSON, null, 2));
    return this._client.search( searchJSON );
  }

  async doScroll( scrollId ) {
    return this._client.scroll( 
      {
        scroll: '10s',
        scrollId: scrollId
      }
    );
  }

  buildSearchJSON( searchJSON ) {
    return {
      scroll: '10s',
      body: searchJSON
    }
  }

  emitHeader( header ) {
    this._outputFile.append( header );
  }

  emitRows( rows ) {
    this._outputFile.append( rows );
  }

  async emitComplete() {
    return this._outputFile.close();
  }

  async processBatch( result ) {

    let hits = result.hits;
    let currentScrollId = result._scroll_id;
  
    while (hits && hits.hits.length) {
      
      this.emitRows(this._formatter.formatRows(result));

      const scrollResult = await this.doScroll(currentScrollId);
  
      hits = scrollResult.hits;
      currentScrollId = scrollResult._scroll_id;
    }
  }

  async runReport( requestJSON ) {
    const searchJSON = this.buildSearchJSON(this._queryGenerator.buildQueryJson( requestJSON, null, scrollResultSize ));
    
    const searchResult = await this.doSearch( searchJSON );
    
    this.emitHeader(this._formatter.formatHeader(searchResult));

    await this.processBatch( searchResult );

    const reportURI = await this.emitComplete();

    console.log("runReport complete, reportURI=" + reportURI);

    return reportURI;
  }

  async generate( requestJSON ) {
    return await this.runReport( requestJSON );
  }
}

module.exports = ReportGenerator;
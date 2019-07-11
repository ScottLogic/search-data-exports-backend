/*
This code is responsible to making ES queries from the JSON inputted, as we want to hide some of the nitty gritty from the users. 
*/
const QueryGenerator = require(`./query.js`);

const esUrl = ( process.env.ES_SEARCH_API) ? process.env.ES_SEARCH_API : `http://localhost:9200`;  // URL to elastic search

const {Client} = require('@elastic/elasticsearch'); //https://www.elastic.co/blog/new-elasticsearch-javascript-client-released
const client = new Client( { node: esUrl } );

class ESSearch {

    constructor() {  
        this._queryGen = new QueryGenerator();      
    }

    // Actually perform the search to the Elastic Search
    async doSearch(searchJSON) {
        return await client.search(searchJSON);        
    }

    buildRequestJSON(searchJSON,method) {
        return {
            body:searchJSON,
            index: method
        };
    }

    async searchPosts(requestJSON) {               
        return this.doSearch(this.buildRequestJSON(this._queryGen.buildQueryJson(requestJSON,"post"),"posts"));
    }

    async searchUsers(requestJSON) {
        return this.doSearch(this.buildRequestJSON(this._queryGen.buildQueryJson(requestJSON,"user"),"users"));
    }

    async search(requestJSON) {
        return this.doSearch(this.buildRequestJSON(this._queryGen.buildQueryJson(requestJSON)));
    }

}

module.exports = ESSearch;
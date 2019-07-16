/* This code is responsible to making ES queries from the JSON inputted, as we want to hide some of the nitty gritty from the users. */
const QueryGenerator = require(`./query.js`);
const {Client} = require('elasticsearch'); 


class ESSearch {    

    constructor( ESConnectOptions = { } ) {          
        this._queryGen = new QueryGenerator();      
        this._connectionOptions = ESConnectOptions;        
        this._client = new Client( ESConnectOptions );
    }

    // Actually perform the search to the Elastic Search
    async doSearch(searchJSON) {
        return await this._client.search(searchJSON);        
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

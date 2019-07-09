/*
This code is responsible to making ES queries from the JSON inputted, as we want to hide some of the nitty gritty from the users. 
*/
const esUrl = `http://localhost:9200`;  // URL to elastic search

const {Client} = require('@elastic/elasticsearch'); //https://www.elastic.co/blog/new-elasticsearch-javascript-client-released
const client = new Client( { node: esUrl } );

class ESSearch {

    constructor() {    
    }

    async performESSearch(searchJSON) {
        console.log(`Start ES Search`);
        const actualJSON = { body:searchJSON, index: "posts" };
        console.log(`RequestJSON made`);
        let result = await client.search(actualJSON); // result is a promise. 
        console.log(result);
        console.log(`About to end`);
        return result;
        
    }

    getStuff(request) {
        client.search(request, (err,res) => 
        {
            console.log(`Return `,res.body);
            return res;
        });        
    }

    doSearch(request) {                
        client.search(request).then( (result) => {
            console.log(`resulting`,result);
            return result;
        });                        
        //return result;
    }

    seachPost2 (searchJSON) {
        console.log(`Starting`);
        const actualJSON = {
            body:searchJSON,
            index: "posts"
        }

        const a = this.getStuff(actualJSON);

        //console.log(`Getting`);
        //let a = await this.getStuff(actualJSON);        

        console.log(`POST THING`,a);
        return a;
    }

    searchPost( searchJSON ) {    
        
        const actualJSON = {
            body:searchJSON,
            index: "posts"
        }

        //let searchResults = this.doSearch(actualJSON);  
        console.log(`Pre Search`);
        const x = client.search(actualJSON).then( ( result ) => {
            console.log(`Search Complete`);
        });
        console.log(`Post Search`);
        return x;
        
        // searchResults.then( function(result) {
        //     console.log(`Done`);
        // },function (err) {
        //     console.log(`Broke`);
        // })

        // searchResults.then( x => {
        //     console.log(`THISIS`,x);
        //     return x;
        // })        

        // console.log(`Let!!!`,searchResults);
        // searchResults.then( (result) => {
        //     console.log(`work`,result);
        //     return { "ok":"ok"}
        // }, () => {
        //     console.log(`errored`);
        //     return { "ok": "no"}
        // })
        //return {};
        

        // client.search({            
        //     body:searchJSON,
        //     index: "posts"
        // }, (err,res) => {
        //     console.log(res.body);
        //     console.log(err,`Error`);
        //     return res.body;
        // });   
        console.log(`Returned`) ;
    }

    
}

module.exports = ESSearch;
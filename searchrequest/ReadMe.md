# Search API

This node API can be used to receive requests in a specific JSON format, and return Elastic Search results.

## Layout
This consist of 2 sections, an API request handler, and the search process.
+ `index.js` - The request handler. This takes in the API requests and forwards accordingly to the search class. 
+ `search.js` - Javascript class which can be used to send requests to ElasticSearch.  
+ `query.js` - Helper class to deal with JSON transformations for ElasticSearch.

## Requirements
+ npm or **yarn** (Prefered)
+ ElasticSeach URL. 

## Setup 
+ Run `yarn install` to setup pre-requisutes.
+ Run `yarn start` to start the NodeJS Express API. 

## Configuration
### Ports
The NodeJS api can be configured to run on different ports etc, by modifying the `./app/index.js` file. By default the port is on 3000.
```javascript 
const port = 3000;
```
### Elastic Search Connection
To define the connection string to the ElasticSearch which is in use, modify `./app/search.js` to supply the correct URL. 
```javascript
const esUrl = `http://localhost:9200`;  // URL to elastic search
```

## API Requests
The API can accecpt requests on the following end points. All current endpoints take the same accecpted JSON formats. *Api requests can be tested/mocked via PostMan.*
+ `/search/` - Default search, will search on all indexs/types unless given parametrs not to. 
+ `/search/post/` - Searches posts only, this will ignore the `type` from any inputted JSON.  
+ `/search/user/` - Searches users only, this will ignore the `type` from any inputted JSON.



### Input JSON format
The inputted JSON can be in the format below, and must be properly formatted JSON. and extra fields which are not listed below are ignored. 
```JSON
{
    "type":"user|post|", /* Ignored if using direct endpoint */
    "resultSize" : 0, /* How many results to return in a set. default:10 */
    "page": 0, /* Which page of results is required. default:0 */
    "search": [
        {"field": "fieldName|all",
         "value": "value"},
        ...
        {"dateRange": [ "Start Date", "End Date"]} // Optionial for Post search.
    ]
}
```
### Output JSON format
Outputted data is in the standard ElasticSearch return format. E.g.
```JSON
{
    "took": 4,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 0,
            "relation": "eq"
        },
        "max_score": 0,
        "hits": [...]
    }
}
```
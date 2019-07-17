# Input / Output JSON formats. 

Below is a example output of how the Input and Output JSON formats for the API could look. 
The input json is already in place currently and will not be changing.

## Input JSON
All search JSON must be in the following format. 
```json 
{
    "type" : "", 
    "resultSize" : 10, 
    "page" : 0, 
    "search" : [        
        { "field" : "all", "value" : "value" }                 
        { "dateRange" : ["dateTime","dateTime"] } 
    ]
} 
```
+ `type` : If supplied can limit search to just `user` or `post`. Missing or empty will assume to search all. 
+ `resultsSize` : How many results are returned per set (Default : 10)
+ `page` : Page offset for large results set
+ `dateRange` : *Optional*, can be used to filter dates on indexes which support them. a single entry arry will be every date >= provided, where as two entries will be a range between them. 
+ `{ "field": "name", "value":"value"}`: used to search on specific fields. or if `all` is supplied as a field, will search on all set text fields. 


## Output JSON
Below is an example of how the output JSON will be formatted. for both Posts and Users

### Posts
```json
{
    "status" : "ok",
    "statusMsg" : "",
    "totalResults": 1,
    "resultsCount" : 1,
    "results" : [
        { "uuid" : "uuid",
        "Type" : "post",
        "Relevance" : 4.552,
        "UserID" : 1,
        "DateCreated" : "2019-01-01...",
        "Content" : "Example Post",
        "Tags" : [ "#Hash", "#Tag",]
        }
    ]
}

```

### Users
```json
{
    "status" : "warn",
    "statusMsg" : "Request shards missmatch, status[success:1,skipped:1,failed:0]",
    "totalResults": 1,
    "resultsCount" : 1,
    "results" : [
        { "uuid" : "uuid",
        "Type" : "user",
        "Relevance" : 4.552,
        "UserID" : 1,
        "LastName": "Person",
        "FirstName": "Random",
        "EmailAddress": "Random.Person@Email.com"
        }
    ]
}

```
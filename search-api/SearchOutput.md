# Input / Output JSON formats. 

Below is a example output of how the Input and Output JSON formats for the API could look. 
The input json is already in place currently and will not be changing.

## Input JSON

## Output JSON
Below is an example of how the output JSON will be formatted. 

```json
{
    "status" : "ok|warn|error",
    "statusMsg" : "string",
    "totalResults": 0,
    "resultsCount" : 0,
    "results" : [
        { "uuid" : "_id",
        "type" : "_type",
        "relevance" : "_score",
            { ..._source } 
        }
    ]
}

```
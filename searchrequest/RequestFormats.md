
API call specification
```json {
    "type" : "user|post", // defaults to blank, which should search both indexes. 
    "results" : int Default:10, 
    "page" : int Default:0,
    "search" : [
        {"all" : "value" }, // Search on every field
        {"field" : "value" } ... // seach on a specific fields.
        // These can be added to the array list and will all be applied to the results. 
    ]
} 
```

Call Example, this would return all posts where there exists a tag called #Value.
```json {
    "type" : "post",
    "results" : 25, 
    "page" : 1,
    "search" : [        
        {"Tags" : "#Value" },
    ]
}
```

## Example response
Going to use the default elastic search response in feedback, as this contains all the information you could require. 

```json {
    "took": 37,
    "timed_out": false,
    "_shards": {
        "total": 2,
        "successful": 2,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": int,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [ ... ]
    }
}
```

Example data from within the hits list is as 
Users - 
```json {
    "_index": "users",
    "_type": "user",
    "_id": "kiEH0msBcSVQ8Ni1lRo7",
    "_score": 1.0,
    "_source": {
        "UserID": 1,
        "LastName": "ADAM",
        "FirstName": "Lyall",
        "EmailAddress": "_vs1_@ss.Q"
    }
}
```

Posts - 
```json {
    "_index": "posts",
    "_type": "post",
    "_id": "9iEH0msBcSVQ8Ni1lRpT",
    "_score": 1.0,
    "_source": {
        "UserID": "30",
        "DateCreated": "2018-03-01T19:17:41.49Z",
        "Content": "Be eco-friendly - unplug electronics when you're finished using them",
        "Tags": [
            "#permanent",
            "#financial"
        ]
    }
}
```



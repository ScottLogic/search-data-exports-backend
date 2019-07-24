# Report Functions - Posts Per Hour

This lambda is responsible for generating a chart (bar/line) of averge posts per hour, over a given range (default 24 hours). 

Input format takes in similar to a standard search for if any params are to be changed, if not it can accept an empty body and still generate. e.g.
```json
{
    "search" : 
        [ 
            { "dateRange" : 
                ["2019-07-21","2019-07-23"] 
            } 
        ]
    }
}
```

Output will contain a http link to the image in question for the client to display to the user. Or in case of any errors an error message will be given, using a similar format to other requests from the API. 
```json
{
    "status" : "ok",
    "statusMsg" : "",
    "results" : "http://some_name_of_file/file_name.png"
}
```

# Notes on runtime for lambda 

Default lambda settings do not appear to work well for this function, due to its complexity, its cold start time is greater than the default timeout, at the lowest resources allowed.
After some testing with various allocated memory sizes, we need at least 192MB assigned to stop timeouts on startup. From the limited test data we have, creating the same report each time, here are some approx times for startup/requests for some of the memory tiers.

Tier (MB) | Cold Start Time (ms) | Normal Run Time (ms) | Start Up Cost ($) | Execution Cost ($)
--- | --- | --- | --- | ---
192 | 2500 | 500~800 | 0.0007825 | 0.0001565~0.0002504
256 | 1900~2100 | 300~600 | 0.0007923~0.0008757 | 0.0001251~0.0002502
512 | 1100 | 200~300 | 0.0009174 | 0.0003962~0.0005943

From the base information we have here, using a larger size Mb increases the cost as well above the benefit in execution time you receive. The benefit from  upgrading to the 256MB memory allocation, gives a sizeable improvement on execution time, along with maintaining the same price bounds.

*This could warrant further experimentation on large lambda functions in regards to at what point, does using a more expensive per 100ms tier actually give positive savings.*

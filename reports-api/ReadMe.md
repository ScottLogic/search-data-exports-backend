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


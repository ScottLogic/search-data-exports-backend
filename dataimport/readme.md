# Data Import Process

## Requirements
+ Npm or **Yarn** (Prefered) 
+ Node.js
+ Java *(v1.8+)*

## Setup
To set up run the command `yarn install` to ensure pre-requisite node modules are downloaded. 

## Running
**Before running ensure that you have configured the Elastic Search api link correctly.** See Configuration below.

The following yarn commands are available to use each function seperatly. 
+ `yarn createPosts` - Create a csv of example posts, default 1000, into `./data/posts.csv`
+ `yarn createUsers` - Create a csv of example users, default 100, into `./data/users.csv`
+ `yarn ESImport` - Imports information from the files in `./data` into elastic search. 
+ `yarn helix` - Run both `createPosts` and `CreateUsers` in succession. 
+ `yarn helixESImport` - Run both create processes and then import them into Elastic Search. 

## Configuration
### Word List files
+ content.csv
+ tags.csv

These 2 files contain lists of sample #tags and post content. Extra words / phrases can be added / removed from these files as you see fit to modify the range of values the system can produce. 

### Data Helix
To increase the amount of results Data Helix will produce, within `package.json` the scripts for each process are listed. To change the rows created change the parameter `max-rows=xxx` to the number you require.

Defaults are `Users = 100` and `Posts = 1000`.

### Elastic Search Inport
To change options for the elastic search import, modify the following file `./app/dataImport.js`, the variables listed below can be changed as requred.

#### Other Elastic Seach Options
+ `esURL` - API path for elastic search. (Default: `http://localhost:9200`)
+ `esIndexPosts` - Index name for the posts to be loaded in. (Default: `posts`)
+ `esIndexUsers` - Index name for users to be loaded into. (Default: `users`) 
+ `esTypePosts` - Document name for an individual post. (Default: `post`)
+ `esTypeUsers` - Document name for an individual user. (Default: `user`) 
+ `importFilePosts` - File path and name of posts import file.  (Default: `./data/posts.csv`)
+ `importFileUsers` - File patch and name for users import file.  (Default: `./data/users.csv`)

# Elastic Search Data Format
The following JSON format has been created for use within elastic search. 
+ Users under `/users/user/`
```json
{
    "UserID": "integer",
    "LastName": "string",
    "FirstName": "string",
    "EmailAddress": "string"
}
```
+ Posts under `/posts/post`
```json
{
    "UserID": "integer",
    "DateCreated": "dateTime",
    "Content": "string",
    "Tags": [ "string", ...]
}
```
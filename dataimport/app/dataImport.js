const esUrl = `http://localhost:9200`;  // URL to elastic search
const esIndexPosts = "posts";  // Index (DB Name) for imported data
const esIndexUsers = "users";  // Index (DB Name) for imported data
const esTypePosts = "post";  // (Table Name) for imported data
const esTypeUsers = "user";  // (Table Name) for imported data
const importFilePosts = `./data/posts.csv`; // Import file location
const importFileUsers = `./data/users.csv`; // Import file location

const csv = require(`csvtojson`); // https://github.com/Keyang/node-csvtojson
const {Client} = require('@elastic/elasticsearch'); //https://www.elastic.co/blog/new-elasticsearch-javascript-client-released
const client = new Client( { node: esUrl } );

const insertJsonUsers = JSON.stringify({ "index": { "_index" : esIndexUsers , "_type":esTypeUsers }}) + `\n`;
const insertJsonPosts = JSON.stringify({ "index": { "_index" : esIndexPosts , "_type":esTypePosts }}) + `\n`;
let userCounter = 0;

console.log(`Start User Import`);
csv().fromFile(importFileUsers).then( (JsonObject) => {        
    const actualData = JsonObject.reduce( ( prev, current ) => prev + insertJsonUsers + JSON.stringify( convertUserJSON(current)) + `\n`,'');         
    client.bulk( { body: actualData } , (err,result) => {
        if (err) {
            console.log(`User Import - Errors Happened `, err);
        }            
        console.log(`User Import Complete`);
    });
});

// Read the csv file into a JSON object
console.log(`Start Posts Import`);
csv().fromFile(importFilePosts).then( (JsonObject) => {        
        const actualData = JsonObject.reduce( ( prev, current ) => prev + insertJsonPosts + JSON.stringify( convertJson(current)) + `\n`,'');                
        client.bulk( { body: actualData } , (err,result) => {
            if (err) {
                console.log(`Post Import - Errors Happened `, err);
            }            
            console.log(`Post Import Complete`);
        });
});

console.log(`All Processes Complete`);

const convertUserJSON = (jsonObject) => {
    userCounter++;
    return {
        "UserID" : userCounter,
        ...jsonObject
    };
}

const convertJson = (jsonObject) => { 

    const tagList = [
        jsonObject.tag1,
        jsonObject.tag2,
        jsonObject.tag3,
        jsonObject.tag4,
        jsonObject.tag5
    ];

    // use of filter gets rid of empty values in the array. as some may be blank from the generator. 
    return {
        "UserID":jsonObject.UserID,
        "DateCreated":jsonObject.DateCreated,
        "Content": jsonObject.Content,
        "Tags" : tagList.filter(x => x)
    };
}




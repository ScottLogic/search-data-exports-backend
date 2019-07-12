exports.handler = function(event, context, callback) {

  const AWS = require('aws-sdk');
  const connectionClass = require('http-aws-es');
  //const elasticsearch = require('elasticsearch');

  const ESSearch = require(`./common/search.js`);
  const {Client} = require('elasticsearch'); 

  const client = new Client( {    
    host: (process.env.ES_SEARCH_API) ? process.env.ES_SEARCH_API : `http://localhost:9200` ,
    connectionClass: require('http-aws-es'),
    awsConfig:new AWS.Config({
        credentials : new AWS.EnvironmentCredentials('AWS')
    })
  });
  //const client = new Client( { node: process.env.ES_SEARCH_API } );
  
  //console.log(client);
  client.search({}, (x,res) => {
    console.log(`THIS`,res,x);
  });
  
  //const search = new ESSearch();
  
  // callback(null, {
  //         statusCode: '200',
  //         body: JSON.stringify({ "Context": context,"Event":event }),
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });


  // search.searchPosts(event).then( (result) => {

  //     callback(null, {
  //         statusCode: '200',
  //         body: JSON.stringify(result),
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });

  // }).catch( (error) => {
  //     callback(null, {
  //         statusCode: '200',
  //         body: JSON.stringify({ 'message': 'ERROR', 'errorMessage' : error }),
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  // })

//   callback(null, {
//     statusCode: '200',
//     body: JSON.stringify({ 'message': 'This is the hello world', 'request' : event }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
};

this.handler();

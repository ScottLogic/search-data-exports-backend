const AWS = require('aws-sdk');
const connectionClass = require('http-aws-es');
const ESSearch = require(`./common/search.js`);

exports.handler = function(event, context, callback) {    
 
  let eventJson;
  try {
    eventJson = JSON.parse(event.body);
  } catch (error) {
    callback(null, {
      statusCode: '400',
      body: JSON.stringify({ 'message': 'INPUT ERROR', 'errorMessage' : error, "content": event.body }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  if (eventJson) {    
    const ESConnectOptions = {    
      host: (process.env.ES_SEARCH_API) ? process.env.ES_SEARCH_API : `http://localhost:9200` ,
      connectionClass: connectionClass,
      awsConfig:new AWS.Config({
          credentials : new AWS.EnvironmentCredentials('AWS')
      })
    };  
    const search = new ESSearch( ESConnectOptions );

    search.search(eventJson).then( result => {    
        callback(null, {
            statusCode: '200',
            body: JSON.stringify(result),
            headers: {
              'Content-Type': 'application/json',
            },
          });
    }).catch( error => {      
        callback(null, {
            statusCode: '400',
            body: JSON.stringify({ 'message': 'ERROR', 'errorMessage' : error }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
    });
  }
};
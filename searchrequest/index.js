exports.handler = function(event, context, callback) {

    const ESSearch = require(`./app/search.js`);
    const search = new ESSearch();

    search.searchPosts(event).then( (result) => {

        callback(null, {
            statusCode: '200',
            body: JSON.stringify(result),
            headers: {
              'Content-Type': 'application/json',
            },
          });

    }).catch( (error) => {
        callback(null, {
            statusCode: '200',
            body: JSON.stringify({ 'message': 'ERROR', 'errorMessage' : error }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
    })

//   callback(null, {
//     statusCode: '200',
//     body: JSON.stringify({ 'message': 'This is the hello world', 'request' : event }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
};

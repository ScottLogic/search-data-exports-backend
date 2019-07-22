const AWS = require("aws-sdk");
const connectionClass = require("http-aws-es");
const graphGenerator = require('./graphGenerator');


const callbackHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};


exports.handler = async function(event, context, callback) {

    let eventJson;
    try {
        eventJson = JSON.parse(event.body);
    } catch (error) {
        console.log(`Failed Parse - `,error);
        return;
    }

    const ESConnectOptions = {
        host: `http://localhost:9200`,        
    };

    const g = new graphGenerator(ESConnectOptions);
    
    const resultList = await g.getReportData(eventJson);

    console.log(`Results = `,resultList.aggregations);


};

/* This is for running the code locally, and will be removed from the git report upon conversion to the lambda 
*/

const main = require('./index');

const eventBody = {
    body: '{ \"search\" : [ { \"dateRange\" : [\"2019-07-21\",\"2019-07-23\"] } ]}'
};

const eventBodyBlank = {
    body: '{ \"search\" : [ ]}'
};

const CallBack = () => {
    console.log("WOO");
}

main.handler(eventBody,"context",CallBack);
//main.handler(eventBodyBlank,"context",CallBack);

const main = require('./index');


const eventBody = {
    body: '{ \"search\" : [ { \"dateRange\" : [\"2019-07-21\",\"2019-07-23\"] } ]}'
};

const eventBodyBlank = {
    body: '{ \"search\" : [ ]}'
};


//main.handler(eventBody,"context","CallBack");
main.handler(eventBodyBlank,"context","CallBack");
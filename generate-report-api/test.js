const ReportGenerator = require('./src/report-generator.js');
const CSVFormatter = require('./src/csv-formatter.js');
const ConsoleOutput = require('./src/console-output.js');
const sendEmail = require('./src/send-email.js');

const configOptions = {
  host: 'http://localhost:9200',
}

const requestJSON = {
  "type" : "post", 
  "resultSize" : 5, 
  "search" : [        
      { "field" : "all", "value" : "test" }                 
  ]
};

sendEmail("test@royharrington.co.uk", "filesname");

const generateReport = new ReportGenerator(configOptions, new CSVFormatter(), new ConsoleOutput());

generateReport.generate(requestJSON).then(result => {
  console.log( 'Result:' + result );
});



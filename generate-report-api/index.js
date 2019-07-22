const AWS = require("aws-sdk");
const connectionClass = require("http-aws-es");
const ReportGenerator = require("./src/report-generator.js");
const CSVFormatter = require('./src/csv-formatter.js');
const S3Output = require('./src/s3-output.js');
const sendEmail = require('./src/send-email.js');

exports.handler = async (event) => {
  try {
    let message = event.Records[0].Sns.Message

    console.log("message: " + message );
    const data = JSON.parse(message);

    const bucketName = process.env.S3_BUCKET_NAME;
    const generateReport = new ReportGenerator(getConfig(), new CSVFormatter(), new S3Output(bucketName));

    let reportURI = await generateReport.generate(data.searchCriteria);

    await sendEmail(data.parameters.emailAddress, reportURI);

    return sendRes(200, { reportURI: reportURI});
  } catch (e) {
    console.log("Error generating report: " + e.toString() );
    return sendRes(500, { error:  e.toString() });
  }
}

const getConfig = () => {
  return  {
    host: process.env.ES_SEARCH_API,
    connectionClass: connectionClass,
    awsConfig: new AWS.Config({
      credentials: new AWS.EnvironmentCredentials("AWS")
    })
  };
}

const sendRes = (status, body) => {
  var response = {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };

  return response;
}

const ReportGenerator = require('./app/report-generator.js');
const S3Output = require('./app/s3-output.js');

exports.handler = async (event) => {
  console.log(`event\n${JSON.stringify(event, null, 2)}`);

  const reportGenerator = new ReportGenerator(new S3Output(process.env.S3_BUCKET_NAME));

  const reportURL = await reportGenerator.generate(event.searchCriteria);

  return { reportURL };
};

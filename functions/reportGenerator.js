import ReportGenerator from '../common/reportGenerator/report-generator';
import S3Output from '../common/reportGenerator/s3-output';

export async function handler(event) {
  console.log(`event\n${JSON.stringify(event, null, 2)}`);

  const reportGenerator = new ReportGenerator(new S3Output(process.env.S3_BUCKET_NAME));

  const reportURL = await reportGenerator.generate(event.searchCriteria);

  return { reportURL };
}

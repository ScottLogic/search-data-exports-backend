import { S3 } from 'aws-sdk';
import uuidv4 from 'uuid/v4';
import { fileTimeout, signedUrlTimeout } from '../s3_expiry';

class S3Output {
  constructor(bucketName) {
    this._reportBuffer = '';
    this._bucketName = bucketName;
  }

  append(str) {
    this._reportBuffer = this._reportBuffer.concat(str);
  }

  async writeBufferToS3() {
    const s3 = new S3();

    console.log(`Bucketname=${this._bucketName}`);
    console.log(`Before S3 putObject - report size=${this._reportBuffer.length}`);
    const filename = `${uuidv4()}.csv`;

    await s3.putObject({
      Bucket: this._bucketName,
      Key: filename,
      ContentType: 'text/csv',
      ContentDisposition: 'download; fileName="Report.csv"',
      Body: Buffer.from(this._reportBuffer, 'ascii'),
      Expires: fileTimeout()
    }).promise();

    return s3.getSignedUrl('getObject', {
      Bucket: this._bucketName,
      Key: filename,
      Expires: signedUrlTimeout()
    });
  }

  async close() {
    const reportURI = await this.writeBufferToS3();

    console.log(`reportURI=${reportURI}`);

    return reportURI;
  }
}

export default S3Output;

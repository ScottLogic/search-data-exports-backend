import { S3 } from 'aws-sdk';
import uuidv4 from 'uuid/v4';
import { fileTimeout } from '../s3_expiry';

class S3Output {
  constructor(bucketName) {
    this._reportBuffer = '';
    this._bucketName = bucketName;
  }

  append(str) {
    this._reportBuffer = this._reportBuffer.concat(str);
  }

  async writeBufferToS3(downloadMode = true) {
    const s3 = new S3();
    const filename = `${uuidv4()}.svg`;
    const expireDate = new Date(Date.now());
    expireDate.setHours(expireDate.getHours() + (process.env.S3_OBJECT_TIMEOUT || 1));

    await s3
      .putObject({
        Bucket: this._bucketName,
        Key: filename,
        ContentType: 'image/svg+xml',
        ContentDisposition: `${downloadMode && 'download;'} fileName="Chart.svg"`,
        Body: Buffer.from(this._reportBuffer, 'ascii'),
        ACL: 'public-read',
        Expires: fileTimeout()
      })
      .promise();

    return `https://${this._bucketName}.s3.amazonaws.com/${filename}`;
  }

  async close(downloadMode) {
    const reportURI = await this.writeBufferToS3(downloadMode);
    return reportURI;
  }
}

export default S3Output;

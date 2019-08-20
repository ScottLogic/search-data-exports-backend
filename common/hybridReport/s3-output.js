import { S3 } from 'aws-sdk';
import uuidv4 from 'uuid/v4';
import { fileTimeout, signedUrlTimeout } from '../s3_expiry';

class S3Output {
  constructor(bucketName) {
    this._bucketName = bucketName;
  }

  addBuffer(buffer) {
    this._reportBuffer = buffer;
  }

  async writeBufferToS3() {
    const s3 = new S3();
    const filename = `${uuidv4()}.pdf`;

    await s3.putObject({
      Bucket: this._bucketName,
      Key: filename,
      ContentType: 'application/pdf',
      ContentDisposition: 'download; fileName="Report.pdf"',
      Body: this._reportBuffer,
      Expires: fileTimeout()
    }).promise();

    return s3.getSignedUrl('getObject', {
      Bucket: this._bucketName,
      Key: filename,
      Expires: signedUrlTimeout()
    });
  }

  async close() {
    return this.writeBufferToS3();
  }
}

export default S3Output;

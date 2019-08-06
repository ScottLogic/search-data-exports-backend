const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

class S3Output {
  constructor(bucketName) {
    this._bucketName = bucketName;
  }

  addBuffer(buffer) {
    this._reportBuffer = buffer;
  }

  async writeBufferToS3() {
    const s3 = new AWS.S3();
    const filename = `${uuidv4()}.pdf`;

    await s3.putObject({
      Bucket: this._bucketName,
      Key: filename,
      ContentType: 'application/pdf',
      ContentDisposition: 'download; fileName="Report.pdf"',
      Body: this._reportBuffer,
      ACL: 'public-read'
    }).promise();

    return `https://${this._bucketName}.s3.amazonaws.com/${filename}`;
  }

  async close() {
    return this.writeBufferToS3();
  }
}

module.exports = S3Output;

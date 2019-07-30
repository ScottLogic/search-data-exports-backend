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

    const response = await s3.putObject({
      Bucket: this._bucketName,
      Key: filename,
      ContentType: 'application/pdf',
      Body: this._reportBuffer,
      ACL: 'public-read'
    }).promise();

    return `https://${this._bucketName}.s3.amazonaws.com/${filename}`;
  }

  async close() {
    const reportURI = await this.writeBufferToS3();
    return reportURI;
  }
}

module.exports = S3Output;

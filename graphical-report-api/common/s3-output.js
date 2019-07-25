const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

class S3Output {

  constructor (bucketName) {
    this._reportBuffer = '';
    this._bucketName = bucketName
  }

  append( str ) {
    this._reportBuffer = this._reportBuffer.concat(str);
  }

  async writeBufferToS3() {
    let s3 = new AWS.S3();
    const filename = uuidv4() + '.svg';

    const response = await s3.putObject({
      Bucket: this._bucketName,
      Key: filename,
      ContentType: 'image/svg+xml',
      Body: Buffer.from(this._reportBuffer, 'ascii'),
      ACL:'public-read'
    }).promise();

    return 'https://' + this._bucketName + '.s3.amazonaws.com/' + filename;
  }

  async close() {
    const reportURI = await this.writeBufferToS3();
    return reportURI;
  }
}

module.exports = S3Output;
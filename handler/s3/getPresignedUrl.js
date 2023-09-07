const aws = require('aws-sdk');
const s3 = new aws.S3();
const { response } = require('../../utils/index.js');
const {v4: uuidv4} = require('uuid');

module.exports.handler = async (event) => {
  console.log("Event: ", event);
  const { folderPath, contentType, bucketName, id } = JSON.parse(event.body);
  const ext = contentType.split('/')[1];
  const params = {
      Bucket: bucketName,
      Key: `${folderPath}${id || uuidv4()}.${ext}`,
      ContentType: contentType,
  };
  const preSignedUrl = s3.getSignedUrl('putObject', params);
  return response(200, preSignedUrl)
}

const aws = require('aws-sdk');
const { response } = require('../../utils/index.js');
const bucketName = "bilguun-tech-bucket";

module.exports.handler = async (event) => {
  console.log("Event: ", event);
  const { sourcePath, targetPath } = JSON.parse(event.body);

  const rekognition = new aws.Rekognition();
  const res = await rekognition.compareFaces({
     SourceImage: {
         S3Object: {
           Bucket: bucketName,
           Name: sourcePath
         },
     },
     TargetImage: {
        S3Object: {
            Bucket: bucketName,
            Name: targetPath
        }
    }
  }).promise();
  const { Similarity } = res?.FaceMatches[0];
  
  const isSimilar = Similarity > 50;

  return response(200, {isSimilar});
}

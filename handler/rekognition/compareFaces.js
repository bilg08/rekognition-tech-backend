const aws = require("aws-sdk");
const { response } = require("../../utils/index.js");
const bucketName = "bilguun-tech-bucket";

module.exports.handler = async (event) => {
  console.log("Event: ", event);
  const { sourcePath, targetPath } = event.body;

  const rekognition = new aws.Rekognition();
  const res = await rekognition
    .compareFaces({
      SimilarityThreshold: 80,
      SourceImage: {
        S3Object: {
          Bucket: bucketName,
          Name: sourcePath,
        },
      },
      TargetImage: {
        S3Object: {
          Bucket: bucketName,
          Name: targetPath,
        },
      },
    })
    .promise();
  console.log(res);
  let isSimilar = false;
  if (res?.FaceMatches.length > 0) {
    isSimilar = true;
  }

  return response(200, { isSimilar });
};

const aws = require("aws-sdk");
const { response } = require("../../utils/index.js");

module.exports.handler = async (event) => {
  console.log("Event: ", event);
  const { path, bucket } = event.body;
  const rekognition = new aws.Rekognition();

  try {
    const params = {
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: path,
        },
      },
    };
    const res = await rekognition.detectText(params).promise();
    const texts = res?.TextDetections?.map((item) => item.DetectedText);
    return response(200, { texts });
  } catch (err) {
    console.log(err, "ERROR");
    return;
  }
};

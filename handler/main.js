const {
  response,
  invokeLambda,
  convertUserInfo,
} = require("../utils/index.js");

module.exports.handler = async (event) => {
  console.log("Event: ", event);
  const { sourcePath, targetPath } = JSON.parse(event.body);

  // face rekognition
  const { isSimilar } = await invokeLambda(
    "serverlessbackend-dev-compareFaces",
    {
      sourcePath: sourcePath,
      targetPath: targetPath,
    },
  );

  if (!isSimilar) return response(400, "Адилхан царай биш байна");

  // texts detection from source which is identity card image

  const { texts } = await invokeLambda(
    "serverlessbackend-dev-detectTextFromImage",
    {
      path: sourcePath,
      bucket: "bilguun-tech-bucket",
    },
  );
  const thumbnail = `https://bilguun-tech-bucket.s3.amazonaws.com/${targetPath}`;
  const userInfo = convertUserInfo(texts);
  if (!userInfo.lastName || !userInfo.firstName || !userInfo.registrationNumber)
    return response(400, "Иргэний үнэмлэхний зураг биш байна");
  return response(200, { ...userInfo, thumbnail });
};

const aws = require("aws-sdk");
const { response, invokeLambda } = require("../utils/index.js");

module.exports.handler = async (event) => {
  console.log("Event: ", event);
  // const {} = JSON.parse(event.body);

  const compareFacesResponse = await invokeLambda(
    "serverlessbackend-dev-compareFaces",
    {
      sourcePath: "source/175f8f25-ed8e-4e83-9cb2-439ea4b03915.jpeg",
      targetPath: "source/7b083214-19fe-4b19-8b79-b58c60ae78a0.jpeg",
    },
  );
  const { isSimilar } = compareFacesResponse;

  if (!isSimilar) return response(400, "Адилхан царай биш байна");

  const detectTextsFromIdentityCardResponse = await invokeLambda(
    "serverlessbackend-dev-detectTextFromImage",
    {
      path: "source/175f8f25-ed8e-4e83-9cb2-439ea4b03915.jpeg",
      bucket: "bilguun-tech-bucket",
    },
  );
  console.log(detectTextsFromIdentityCardResponse);
  return response(200, "hello");
};

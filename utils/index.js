const aws = require("aws-sdk");

module.exports.response = (statusCode, message) => {
  const success = statusCode === 200 ? true : false;
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify({
      success: success,
      data: message,
    }),
  };
};

module.exports.invokeLambda = async (functionName, payload) => {
  const lambda = new aws.Lambda();
  const res = await lambda
    .invoke({
      FunctionName: functionName,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ body: payload }),
    })
    .promise();
  console.log(res, "k", res.Payload);
  const rPayload = JSON.parse(res.Payload);
  const body = JSON.parse(rPayload?.body);
  const data = body?.data;

  return data;
};

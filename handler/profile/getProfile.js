const { response, connectMongo } = require("../../utils/index.js");
module.exports.handler = async (event) => {
  console.log("Event: ", event);
  const { id } = event.queryStringParameters;
  await connectMongo();
  const Profile = require("../../model/profile.js");
  try {
    const pro = await Profile.findById(id);
    return response(200, { profile: pro });
  } catch {
    return response(400, "Хэрэглэгч олдсонгүй");
  }
};

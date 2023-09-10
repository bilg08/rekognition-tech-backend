const { response, connectMongo } = require("../../utils/index.js");
module.exports.handler = async (event) => {
  console.log("Event: ", event);
  const body = JSON.parse(event.body);
  await connectMongo();
  const Profile = require("../../model/profile.js");
  try {
    const pro = await Profile.create(body);
    return response(200, { profile: pro });
  } catch (err) {
    console.log(err);
    return response(400, "Хэрэглэгч бүртгэгдсэн");
  }
};

const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "НЭРЭЭ ОРУУЛНА УУ"],
  },
  lastName: {
    type: String,
    required: [true, "ОВГОО ОРУУЛНА УУ"],
  },
  registrationNumber: {
    type: String,
    required: [true, "Регистерийн дугаар ОРУУЛНА УУ"],
    unique: [true],
  },
  birthday: {
    type: String,
    required: [true, "Төрсөн өдрийг ОРУУЛНА УУ"],
  },
  thumbnail: {
    type: String,
    required: [true, "Зургийг нь ОРУУЛНА УУ"],
  },
});
module.exports = mongoose.model("Profile", ProfileSchema);

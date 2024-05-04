const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password must be at least 6 characters"],
    },
    location: {
      lat: String,
      lon: String,
    },
    favStores: [String],
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

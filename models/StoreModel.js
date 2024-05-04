const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "the store name must be unique"],
    },
    location: {
      lat: String,
      lon: String,
    },
  },
  { timestamps: true }
);

const storeModel = mongoose.model("Store", storeSchema);
module.exports = storeModel;

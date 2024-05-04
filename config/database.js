const mongoose = require("mongoose");

const dbConnection = async () => {
  const connect = await mongoose.connect(process.env.CONNECTION_STRING);
  console.log("connection established to the db", connect.connection.name);
};

module.exports = dbConnection;

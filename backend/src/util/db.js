const mongoose = require("mongoose");

const connectDb = (URI) => {
  return mongoose.connect(URI, {
    dbName: "stories",
    maxConnecting: 5,
    keepAlive: true,
    socketTimeoutMS: 45000,
  });
};

module.exports = connectDb;

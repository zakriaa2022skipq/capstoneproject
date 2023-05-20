const mongoose = require("mongoose");

const connectDb = (URI) => {
  return mongoose.connect(URI, {
    dbName: "stories",
    maxConnecting: 50,
    keepAlive: true,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });
};

module.exports = connectDb;

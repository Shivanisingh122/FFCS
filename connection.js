const mongoose = require("mongoose");

async function connectToMongoDB(url) {
  return await mongoose
    .connect(url)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log(err));
}

module.exports={
    connectToMongoDB,
}

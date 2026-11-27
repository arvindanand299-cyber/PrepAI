const mongoose = require("mongoose");
require("dotenv").config();

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connection SUCCESS");
    process.exit(0);
  })
  .catch((err) => {
    console.log("MongoDB connection FAILED");
    console.log(err.message);
    process.exit(1);
  });
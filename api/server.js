const mongoose = require("mongoose");
const dotenv = require("dotenv");

//it handles uncaughtException like undefined variable etc.
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!🚫 shutting down app ...");
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });
// it should be loaded before app.js

const app = require("./app");

//this connect method is going to return a promise
mongoose.connect(process.env.DATABASE).then(() => {
  console.log(" DB connection succesfull");
});

const port = process.env.PORT || 3008;
const server = app.listen(port, () => {
  console.log(`hey the server is running on ${port}...`);
});

//it handles unhandledRejection like MOngo not connected error etc
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! ⭐ shutting down app ...");
  console.log(err.name, err.message);
//giving time for the server to handle pending and ongoing req.
  server.close(() => {
    process.exit(1);
  });
});

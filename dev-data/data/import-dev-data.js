const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourSchema");

const test = dotenv.config({
  path: path.resolve(__dirname, "..", "..", "config.env"),
});
const DB = process.env.MONGO_DB;

//db connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((res) => console.log("Database connection established!!"));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

const importData = async () => {
  try {
    await Tour.create(tours);
    return console.log("Objects created");
  } catch (err) {
    return console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    return console.log("Objects deleted");
  } catch (err) {
    return console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

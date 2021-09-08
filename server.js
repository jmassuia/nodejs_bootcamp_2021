const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "config.env") });

const app = require("./app");
const DB = process.env.MONGO_DB;

//db connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((res) => console.log("Database connection established!!"));

// const Tour = mongoose.model('Tour', tourSchema);

// const newTour = new Tour({
//   name: 'The waterfalls of new gersey',
//   rating: 4.3,
//   price: 497,
// });

// newTour
//   .save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => console.log(err));

//Log all node environment variables
// console.log(process.env);

const server = app.listen(process.env.PORT_SERVER, () => {
  console.log("Server is running on port 8888");
});

//Handle unhandledRejection into the server
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  //Server broking if an unhandled promise is found
  server.close(() => {
    process.exit(1);
  });
});

//Handle asynchronous code
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Avoid abrupt application termination when instanced in heroku
process.on("SIGTERM", () => {
  console.log("SIGNTERM received!!");

  server.close(() => {
    console.log("Server terminated graceful!!");
  });
});

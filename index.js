const express = require("express");
// const fileUpload = require('express-fileupload');    //multer will not work with this
const cors = require("cors");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const organizationsRouter = require("./routes/organization");
const branchRouter = require("./routes/branch");
const bodyParser = require('body-parser');

require("dotenv").config();   //The dotenv file has our environmental variables

// Create Express Server
const app = express();
const PORT = process.env.PORT || 5000;
let logNo = 0;

//  Middleware
app.use(cors());
app.use(express.json());
// app.use(fileUpload()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.use("/org", organizationsRouter);
app.use("/branch", branchRouter);
app.use("/uploads", express.static("uploads")); //allows /uploads in url to access uploads folder

//  Connect to MongoDB database.
const ATLAS_URI = "mongodb://127.0.0.1:27017/project1";
mongoose
  .connect(ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });

const connection = mongoose.connection;

//  listen for 'error' event 'on' the 'connection', if 'error' execute the arrow function.
connection.on("error", (err) => {
  logNo++;
  console.log(`${logNo}>> Error while connecting to MongoDB database. ${err}`);
});
//  listen for 'disconnected' event 'on' the 'connection', if 'disconnected' execute the arrow function.
connection.on("disconnected", () => {
  logNo++;
  console.log(`${logNo}>> Connection to MongoDB database lost.`);
});
//  listen for 'reconnect' event 'on' the 'connection', if 'reconnect' execute the arrow function.
connection.on("reconnect", () => {
  logNo++;
  console.log(`${logNo}>> Re-Connected to MongoDB database.`);
});
//  'once' the 'connection' is 'open', execute the arrow function.
connection.once("open", () => {
  logNo++;
  console.log(
    `${logNo}>> MongoDB database connection successfully established.`
  );
});

//  Function to start Server and listen to port no PORT.
app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}.`);
});

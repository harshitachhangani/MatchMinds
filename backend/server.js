require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const client = require("./mongodb");
const bodyParser = require("body-parser");

mongoose.set("strictQuery", false);

// const dbURI = "mongodb://localhost:27017/hackbud";
const dbURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

//const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5174' }));
app.use(cors({ origin: 'http://localhost:5173' }));


const auth = require("./routes/auth");
const userCRUD = require("./routes/userCRUD");
const hackathonsCRUD = require("./routes/hackathonsCRUD");
const chatCRUD = require("./routes/chatCRUD");

app.use("/auth", auth);
app.use("/userCRUD", userCRUD);
app.use("/hackathonsCRUD", hackathonsCRUD);
app.use("/chatCRUD", chatCRUD);

const start = async () => {
  try {
    await mongoose.connect(dbURI);
    app.listen(5000, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server side error" });
  }
};

app.use("/", (req, res) => {
  res.send("Hello World");
});

start();

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

// Database connection URL
const dbURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable cross-origin requests from other domains
app.use(bodyParser.json({ limit: "50mb" })); // Increase body size limit for large payloads (useful for file uploads)
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Define your allowed origins for CORS (i.e., React frontend on these URLs)
app.use(cors({ origin: 'http://localhost:5174' })); 
app.use(cors({ origin: 'http://localhost:5173' }));

// Import routes for authentication, CRUD operations, and recommendations
const auth = require("./routes/auth");
const userCRUD = require("./routes/userCRUD");
const hackathonsCRUD = require("./routes/hackathonsCRUD");
const chatCRUD = require("./routes/chatCRUD");

// Import recommendation routes to be used under the '/api' path
app.use('/api', require('./routes/recommendationRoutes'));
app.use('/api', require('./routes/psRoutes'));

// Additional routes (e.g., authentication, user CRUD, hackathons CRUD)
app.use("/auth", auth);
app.use("/userCRUD", userCRUD);
app.use("/hackathonsCRUD", hackathonsCRUD);
app.use("/chatCRUD", chatCRUD);

// Default route for root path
app.use("/", (req, res) => {
  res.send("Hello World");
});

// MongoDB connection and server start
const start = async () => {
  try {
    await mongoose.connect(dbURI);
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server side error" });
  }
};

// Start the server
start();
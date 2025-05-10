const express = require("express");
// const connectDB = require("./config/db");
// const pool = require("../config/db");
const multer = require("multer");
// const path = require("path");
const fileRoutes = require("./routes/FileRoutes");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", fileRoutes); // All routes start with /api

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: "File upload error: " + err.message });
  }
  console.log(err);
  res.status(500).json({ message: err.message });
});

// Configure multer for file uploads
app.get("", (req, res) => {
  res.send("HELLO SERVER STARTED");
});
// Start the server
app.listen(PORT, async () => {
  //   await connectDB();
  //   console.log("Connected to MongoDB");
  console.log(`Server is running on http://localhost:${PORT}`);
});

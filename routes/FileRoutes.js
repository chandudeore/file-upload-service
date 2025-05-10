const express = require("express");
const router = express.Router();
const fileController = require("../controllers/Upload.Controller");
const upload = require("../config/multer");
// Upload a file
router.post("/upload", upload.single("file"), fileController.uploadFile);

// Get all files
router.get("/files", fileController.getFiles);
// Download a file
router.get("/files/:id", fileController.downloadFile);

// Delete a file
router.delete("/files/:id", fileController.deleteFile);

module.exports = router;

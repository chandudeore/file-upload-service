const File = require("../models/FileModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Auto-generate file metadata
    const fileData = {
      original_name: req.file.originalname,
      storage_name: req.file.filename,
      file_path: req.file.path,
      file_size: req.file.size,
      file_type: req.file.mimetype,
      // Auto-generated fields:
      id: uuid, // Or let MySQL auto-increment handle it
      upload_date: new Date(),
    };

    // Save to database
    const fileId = await File.create(fileData);
    // console.log("File ID:", fileId);
    const savedFile = await File.findById(fileId);

    res.status(201).json({
      message: "File uploaded successfully",
      file: savedFile, // Return full file object with auto-generated ID
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(__dirname, "..", file.file_path);
    res.download(filePath, file.original_name);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(__dirname, "..", file.file_path);
    fs.unlinkSync(filePath);
    await File.delete(req.params.id);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

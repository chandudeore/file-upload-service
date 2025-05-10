// const mongoose = require("mongoose");

// const fileSchema = new mongoose.Schema({
//   filename: { type: String, required: true },
//   path: { type: String, required: true },
//   size: { type: Number, required: true },
//   mimetype: { type: String, required: true },
//   uploadedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("File", fileSchema);
const db = require("../config/db");

class File {
  static async create(fileData) {
    // Safely extract properties with proper names
    const fileValues = {
      original_name: fileData.originalname || fileData.original_name,
      storage_name: fileData.filename || fileData.storage_name,
      file_path: fileData.path || fileData.file_path,
      file_size: fileData.size || fileData.file_size,
      file_type: fileData.mimetype || fileData.file_type,
    };

    const result = await db.promiseQuery(
      `INSERT INTO files SET ?`, // Simpler syntax
      fileValues
    );

    // Return ONLY the insertId (number)
    return result.insertId;
  }
  // static async create(fileData) {
  //   const { originalname, filename, path, size, mimetype } = fileData;
  //   console.log("File data:", fileData);

  //   // Remove array destructuring
  //   const result = await db.promiseQuery(
  //     `INSERT INTO files
  //      (original_name, storage_name, file_path, file_size, file_type)
  //      VALUES (?, ?, ?, ?, ?)`,
  //     [originalname, filename, path, size, mimetype]
  //   );

  //   return result.insertId;
  // }

  static async findAll() {
    const rows = await db.promiseQuery(
      "SELECT * FROM files ORDER BY upload_date DESC"
    );
    return Array.isArray(rows) ? rows : [rows]; // Ensure always returning array
  }

  static async findById(id) {
    const rows = await db.promiseQuery("SELECT * FROM files WHERE id = ?", [
      id,
    ]);
    return Array.isArray(rows) ? rows[0] : rows; // Handle single result
  }

  static async delete(id) {
    await db.promiseQuery("DELETE FROM files WHERE id = ?", [id]);
  }
}

module.exports = File;

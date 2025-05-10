// // const mongoose = require("mongoose");

// // const connectDB = async () => {
// //   try {
// //     await mongoose.connect(process.env.MONGO_URI);
// //     console.log("MongoDB connected");
// //   } catch (err) {
// //     console.error("MongoDB connection error:", err);
// //     process.exit(1);
// //   }
// // };

// // module.exports = connectDB;
// require("dotenv").config();
// const mongoose = require("mongoose");

// const MONGODB_URI = process.env.MONGODB_URI;
// // || "mongodb://localhost:27017/defaultdb"

// const ConnectDB = () => {
//   mongoose
//     .connect(MONGODB_URI)
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.error("MongoDB connection error:", err));
// };

// module.exports = ConnectDB;\
// const mysql = require("mysql");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "fileupload",
//   port: 3306,
// });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL!");
// });

// module.exports = connection;
const mysql = require("mysql");
require("dotenv").config(); // Load environment variables

// Create connection pool (better performance than single connection)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "fileupload",
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10, // Maximum number of connections
  queueLimit: 0, // Unlimited queued connections
});

// Verify connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection error:", err.message);
    process.exit(1); // Exit if can't connect
  }

  console.log("Connected to MySQL database!");
  connection.release(); // Release the connection back to the pool
});

// Promisify for async/await support
pool.promiseQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = pool;

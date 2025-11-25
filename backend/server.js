// Load enviroment variables from .env file
const path = require("path");
const dotenv = require ("dotenv");
dotenv.config();

//Import packages
const express = require("express");
const mysql = require("mysql2");   
const cors = require("cors");

console.log("server starting");

//Create express app
const app = express();


//allow JSON request bodies
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend")));



//create a MYSQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database.");
    connection.release();
  }
});

const PORT = process.env.PORT || 3000;

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);


//Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//page routers
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/preferences.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/preferences.html"));
});
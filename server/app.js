const express = require("express");
const cookieParser = require("cookie-parser");
const pool = require("./config/database");
const setupDatabase = require("./config/setupDatabase");
const { createUsersTable } = require("./models/userShema");
const errorMiddleware = require("./middlewares/error")

// database connection
setupDatabase()

createUsersTable();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// import all routes
const user = require("./routes/usereRoutes");

app.use("/api/v1", user);


// error middleware
app.use(errorMiddleware);


module.exports = app;

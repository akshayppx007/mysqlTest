const ErrorHandler = require("../utils/errorHandler");
const pool = require("../config/database");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;
  
    if (!token) {
      return next(new ErrorHandler("Login required to access this resource", 401));
    }
  
    const connection = await pool.getConnection();

    await connection.query(`USE test_database`);

  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from the database based on the decoded user ID
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);
  
      if (rows.length > 0) {
        req.user = rows[0];
        next();
      } else {
        return next(new ErrorHandler("User not found", 404));
      }
    } catch (error) {
      return next(new ErrorHandler("Invalid token", 401));
    } finally {
      connection.release();
    }
  };
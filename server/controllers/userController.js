const catchAsyncErrors = require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/jwtToken");
const { comparePassword } = require("../models/userShema");


// register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, username, bio,  password } = req.body;

    if (!name || !username || !bio || !password) {
		return next(new ErrorHandler("Please fill all fields", 400));
	}

    const connection = await pool.getConnection();

    await connection.query(`USE test_database`);

    const [rows, fields] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length > 0) {
		return next(new ErrorHandler("user already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
    INSERT INTO users (name, username, bio, password)
    VALUES (? , ? , ? , ?)
  `;

  const [result] = await connection.execute(query, [name, username, bio, hashedPassword]);

  const [createdUser] = await connection.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);

 sendToken(createdUser[0], 200, res)

});


// login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return next(new ErrorHandler("enter all fields", 400));
    }

    const connection = await pool.getConnection();

    await connection.query(`USE test_database`);

    const [rows, fields] = await connection.execute('SELECT id, username, password FROM users WHERE username = ?', [username]);

    if (rows.length < 0) {
		return next(new ErrorHandler("user not found", 400));
    }

    if (rows.length > 0) {
        const user = rows[0]

       const isMatched  = await comparePassword(password, user.password);

       if (!isMatched) {
        return next(new ErrorHandler("password incorrect", 403))
       }
       sendToken(user, 200, res);
    }

})


// get user info 
exports.getUserInfo = (req, res) => {
    const userInfo = req.user;
  
    res.json({ user: userInfo });
  };
  

  // logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: "Logged out",
	});
});
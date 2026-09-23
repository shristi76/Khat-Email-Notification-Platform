const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { findUserByEmail, createUser } = require("../models/userModel");

const normalizeEmail = (email) => email?.trim().toLowerCase();
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    // Validation
    if (!name?.trim() || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (
      !isValidEmail(email) ||
      password.length < 8 ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        message:
          "Enter a valid email, a name up to 100 characters, and a password of at least 8 characters",
      });
    }

    const user = await findUserByEmail(email);

    if (user.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser(name.trim(), email, hashedPassword);

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const result = await findUserByEmail(email);

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
};

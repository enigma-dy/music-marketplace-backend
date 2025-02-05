import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { username, email, password, passwordConfirm, role } = req.body;

  if (!username || !email || !password || !passwordConfirm || !role) {
    return res.status(400).json({
      status: "unsuccessful",
      message: "Please fill all required fields",
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      status: "unsuccessful",
      message: "Passwords do not match",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "unsuccessful",
        message: "Email has already been registered",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        status: "unsuccessful",
        message: `${username} is not available, try another username`,
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    const token = await newUser.generateToken();

    res.cookie("maniBeatz", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      status: "successful",
      message: "User has been registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "unsuccessful",
      message: "Failed to register user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "unsuccessful",
        message: "Please fill all required fields",
      });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        status: "unsuccessful",
        message: "Invalid username or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        status: "unsuccessful",
        message: "Invalid username or password",
      });
    }

    const token = await user.generateToken();

    res.cookie("maniBeatz", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "successful",
      message: "User is logged in",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "unsuccessful",
      message: "Failed to login user",
    });
  }
};

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.maniBeatz;

    if (!token) {
      return res.status(400).json({
        status: "unsuccessful",
        message: "Token not valid",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id, email, role } = decoded;
    req.user = { id, email, role };

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "unsuccessful",
      message: "Failed to verify token",
    });
  }
};

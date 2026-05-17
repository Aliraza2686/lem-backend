import jwt from "jsonwebtoken";
import User from "../modals/User.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔐 LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // 🍪 Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: user,
    });
  } catch (error) {
    // res.status(500).json({ message: "Server error" });
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// 🚪 LOGOUT
export const logoutUser = (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
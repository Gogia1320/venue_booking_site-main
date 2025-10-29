const User = require('../models/user');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, contactNumber } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // 2️⃣ Create new user (virtual 'password' hashes automatically)
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      username: shortid.generate(),
      role: "dealer" // optional
    });

    // 3️⃣ Save to DB
    await newUser.save();

    // 4️⃣ Send success response
    return res.status(201).json({ msg: "User successfully registered!" });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ msg: "Something went wrong", error });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User doesn't exist" });
    }

    // 2️⃣ Check password & role
    const isPasswordValid = user.authenticate(password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    if (user.role !== "client") {
      return res.status(403).json({ msg: "Access denied for this role" });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.jwt_secret,
      { expiresIn: "2h" }
    );

    // 4️⃣ Destructure user info
    const { _id, firstName, lastName, profilePicture, email: userEmail, role, fullName, username, contactNumber } = user;

    // 5️⃣ Set token cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });

    // 6️⃣ Send response
    return res.status(200).json({
      token,
      user: { _id, firstName, lastName, profilePicture, email: userEmail, role, fullName, username, contactNumber }
    });

  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({ msg: "Something went wrong", error });
  }
};

const UserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { _id, fullName, firstName, lastName, profilePicture, email, role, username, contactNumber, createdAt } = user;

    return res.status(200).json({
      user: { _id, fullName, firstName, lastName, profilePicture, email, role, username, contactNumber, createdAt }
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ msg: "Something went wrong", error });
  }
};

const signout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ msg: `Sign-out Successfully...!` });
}

module.exports = {
    signup,
    signin,
    signout,
    UserProfile
}
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
    // 2️⃣ Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      username: shortid.generate(),
      role: "dealer",
    });
    // 3️⃣ Save the user to DB
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

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User doesn't exist" });

    const isPasswordValid = user.authenticate(password);
    if (!isPasswordValid) return res.status(400).json({ msg: "Invalid Password" });

    // optional: restrict by role if needed
    // if (user.role !== 'dealer') return res.status(403).json({ msg: "Access denied" });

    const token = jwt.sign(
      { id: user._id, role: user.role, fullName: user.fullName, contactNumber: user.contactNumber },
      process.env.jwt_secret,
      { expiresIn: '2h' }
    );

    const { _id, firstName, lastName, profilePicture, email: userEmail, role, fullName, username, contactNumber } = user;

    res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
    return res.status(200).json({
      token,
      user: { _id, firstName, lastName, profilePicture, email: userEmail, role, fullName, username, contactNumber }
    });

  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({ msg: "Something went wrong", error });
  }
};

const DealerProfile = (req, res) => {
    const { userId } = req.params;
    if (userId) {
        User.findById({ _id: userId })
            .exec((error, _user) => {
                if (error) return res.status(400).json({ msg: `Something went wrong`, error });
                if (_user) {
                    const { _id, fullName, firstName, lastName, profilePicture, email, role, username, contactNumber, createdAt } = _user;
                    return res.status(200).json({
                        user: { _id, fullName, firstName, lastName, profilePicture, email, role, username, contactNumber, createdAt }
                    });
                }
            })
    } else {
        return res.status(404).json({ msg: `Dealer dosen't exits` });
    }
}

const signout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ msg: `Sign-out Successfully...!` });
}

module.exports = {
    signup,
    signin,
    signout,
    DealerProfile
}
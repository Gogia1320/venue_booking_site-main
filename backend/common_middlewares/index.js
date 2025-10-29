const jwt = require('jsonwebtoken');

const requireSignIn = (req, res, next) => {
  try {
    // 1️⃣ Check if Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ msg: "Authorization required" });
    }
    // 2️⃣ Extract the token (after "Bearer ")
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }
    // 3️⃣ Verify token
    const user = jwt.verify(token, process.env.jwt_secret);
    req.user = user; // attach decoded user info

    // 4️⃣ Continue if verification successful
    next();

  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

const clientMiddleware = (req, res, next) => {
    if (req.user.role !== 'client') {
        res.status(400).json({
            msg: 'User access denide'
        })
    }
    next();
}
const dealerMiddleware = (req, res, next) => {
    if (req.user.role !== 'dealer') {
        res.status(400).json({
            msg: 'Dealer access denide'
        })
    }
    next();
}

module.exports = {
    requireSignIn,
    clientMiddleware,
    dealerMiddleware
}
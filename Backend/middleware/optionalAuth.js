const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {}
  }
  next();
};

module.exports = optionalAuth;

const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token, authorization denied" });

  //header format: "Bearer token"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.error("Token verification error: jwt expired");
      return res
        .status(401)
        .json({ error: "Token expired, please log in again" });
    }
    console.error("Token verification error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;

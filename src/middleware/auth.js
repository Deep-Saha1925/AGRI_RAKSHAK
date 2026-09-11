const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  let token = null;

  // 1. Try Authorization header
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  // 2. If no header, try cookie
  if (!token && req.cookies.access_token) {
    token = req.cookies.access_token;

    // Your cookie currently contains "Bearer <token>"
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      error: "Authentication required"
    });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        error: `Requires role: ${role}`
      });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
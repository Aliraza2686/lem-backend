import jwt from "jsonwebtoken";

// Same as auth, but never blocks the request — just attaches req.user when a valid token is present.
const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    }
  } catch (error) {
    // invalid/expired token — treat as unauthenticated
  }
  next();
};

export default optionalAuth;

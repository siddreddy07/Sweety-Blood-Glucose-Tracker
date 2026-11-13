import { verifyToken } from "../helpers/jwt.helper.js";
import { COOKIE_NAME } from "../constants.js";

export function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Please log in." });
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

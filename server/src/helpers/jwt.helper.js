import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN } from "../constants.js";

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

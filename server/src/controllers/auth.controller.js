import bcrypt from "bcrypt";
import { findUserByEmail, findUserById, createUser } from "../services/user.service.js";
import { signToken } from "../helpers/jwt.helper.js";
import { COOKIE_NAME, cookieOptions } from "../constants.js";

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Name, email and password must be text." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "This email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, passwordHash);

    res.status(201).json({ user });
  } catch (err) {
    console.error("signup error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password must be text." });
    }

    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken({ id: user.id });
    res.cookie(COOKIE_NAME, token, cookieOptions);
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("login error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: "Logged out." });
}

export async function me(req, res) {
  try {
    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }
    res.json({ user });
  } catch (err) {
    console.error("me error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

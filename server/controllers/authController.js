import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbInstance } from "../config/db.js";

const collectionName = "users";

// token helper
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "defaultsecret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// POST /signup
export const signupController = async (req, res) => {
  let db = dbInstance();
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, password required" });
    }

    const existing = await db.collection(collectionName).findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    const userObj = {
      name,
      email,
      password: hash,
      role: role || "Customer",
    };

    const result = await db.collection(collectionName).insertOne(userObj);

    const userWithId = { ...userObj, _id: result.insertedId };
    const token = createToken(userWithId);

    res.status(201).json({
      user: { id: result.insertedId, name, email, role: userObj.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /login
export const loginController = async (req, res) => {
  let db = dbInstance();
  try {
    const { email, password } = req.body;

    const user = await db.collection(collectionName).findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /me
export const meController = async (req, res) => {
  let db = dbInstance();
  try {
    const user = await db
      .collection(collectionName)
      .findOne({ _id: req.user.id }, { projection: { password: 0 } });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

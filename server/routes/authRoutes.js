import express from "express";
import {
  signupController,
  loginController,
  meController
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signupController);
authRoutes.post("/login", loginController);
authRoutes.get("/me", authMiddleware, meController);

export default authRoutes;

import express from "express";
import {
  createSessionController,
  joinSessionController,
  getSessionController,
  leaveSessionController
} from "../controllers/sessionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const sessionRoutes = express.Router();

sessionRoutes.post("/create", authMiddleware, createSessionController);

sessionRoutes.post("/join/:code", authMiddleware, joinSessionController);

sessionRoutes.get("/:code", authMiddleware, getSessionController);

sessionRoutes.post("/leave/:code", authMiddleware, leaveSessionController);

export default sessionRoutes;

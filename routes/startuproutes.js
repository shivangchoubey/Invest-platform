import express from "express";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import {
  createStartup,
  getAllStartups,
} from "../controllers/startupcontrollers.js";

const router = express.Router();

// Public route
router.get("/", getAllStartups);

// Founder-only route
router.post("/", protect, authorizeRoles("FOUNDER"), createStartup);

export default router;
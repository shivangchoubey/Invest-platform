import express from "express";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import {
  createStartup,
  getAllStartups,
  getMyStartups,
} from "../controllers/startupcontrollers.js";

const router = express.Router();

// Public route
router.get("/", getAllStartups);

router.get(
  "/my",
  protect,
  authorizeRoles("FOUNDER"),
  getMyStartups
);

// Founder-only route
router.post("/", protect, authorizeRoles("FOUNDER"), createStartup);

export default router;
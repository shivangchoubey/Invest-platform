import express from "express";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import { startupSchema } from "../validations/startupValidations.js";
import {
  createStartup,
  getAllStartups,
  getMyStartups,
  getStartupById
} from "../controllers/startupcontrollers.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

// Public route
router.get("/", getAllStartups);

router.get(
  "/my",
  protect,
  authorizeRoles("FOUNDER"),
  getMyStartups
);
// Founder-only rout
router.post("/", protect, authorizeRoles("FOUNDER"),validate(startupSchema), createStartup);

router.get("/:id", getStartupById);

export default router;
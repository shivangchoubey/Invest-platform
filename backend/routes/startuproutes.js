import express from "express";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import { startupSchema } from "../validations/startupValidations.js";
import {
  createStartup,
  getAllStartups,
  getMyStartups,
  getStartupById,
  updateStartupImage
} from "../controllers/startupcontrollers.js";
import validate from "../middlewares/validate.js";
import { updateImageSchema } from "../validations/startupValidations.js";

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

router.put(
  "/:id/image",
  protect,
  authorizeRoles("FOUNDER"),
  validate(updateImageSchema),
  updateStartupImage
);

export default router;
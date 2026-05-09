import express from "express";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import { startupSchema } from "../validations/startupValidations.js";
import {
  createStartup,
  getAllStartups,
  getMyStartups,
  getStartupById,
  updateStartupImage,
  flagStartup,
  removeStartup,
  raiseAgain,
  deleteStartupCompletely,
  getStartupMessages,
  clearStartupMessages
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

router.post(
  "/:id/flag",
  protect,
  authorizeRoles("INVESTOR"),
  flagStartup
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("FOUNDER"),
  removeStartup
);

router.delete(
  "/:id/complete",
  protect,
  authorizeRoles("FOUNDER"),
  deleteStartupCompletely
);

router.put(
  "/:id/raise-again",
  protect,
  authorizeRoles("FOUNDER"),
  raiseAgain
);

router.get(
  "/:id/messages",
  protect,
  getStartupMessages
);

router.delete(
  "/:id/messages",
  protect,
  clearStartupMessages
);

export default router;
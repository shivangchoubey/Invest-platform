import express from "express";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import {
  approveStartup,
  rejectStartup,
  getPendingStartups,
  getFlaggedStartups,
  ignoreFlag,
  removeFlaggedStartup
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/pending",
  protect,
  authorizeRoles("ADMIN"),
  getPendingStartups
);

router.put(
  "/approve/:id",
  protect,
  authorizeRoles("ADMIN"),
  approveStartup
);

router.put(
  "/reject/:id",
  protect,
  authorizeRoles("ADMIN"),
  rejectStartup
);

router.get(
  "/flagged",
  protect,
  authorizeRoles("ADMIN"),
  getFlaggedStartups
);

router.put(
  "/flagged/:id/ignore",
  protect,
  authorizeRoles("ADMIN"),
  ignoreFlag
);

router.delete(
  "/startups/:id",
  protect,
  authorizeRoles("ADMIN"),
  removeFlaggedStartup
);

export default router;
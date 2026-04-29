import express from "express";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import {
  approveStartup,
  rejectStartup,
  getPendingStartups,
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

export default router;
import express from "express";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import {
  approveStartup,
  rejectStartup,
} from "../controllers/adminController.js";

const router = express.Router();

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
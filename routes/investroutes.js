import express from "express";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import { investInStartup } from "../controllers/investmentcontroller.js";

const router = express.Router();

// Investor-only route
router.post(
  "/",
  protect,
  authorizeRoles("INVESTOR"),
  investInStartup
);

export default router;
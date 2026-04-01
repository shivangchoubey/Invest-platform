import express from "express";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import { investInStartup, getMyInvestments } from "../controllers/investmentcontroller.js";
import { investmentSchema } from "../validations/investmentValidations.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

// Investor-only route
router.post(
  "/",
  protect,
  authorizeRoles("INVESTOR"),
  validate(investmentSchema),
  investInStartup
);
router.get(
  "/my",
  protect,
  authorizeRoles("INVESTOR"),
  getMyInvestments
);

export default router;
import express from "express";
import { registerUser, loginUser } from "../controllers/authcontrollers.js";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";
import { registerSchema,loginSchema } from "../validations/authValidations.js";

const router = express.Router();
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json(req.user);
  }
);

export default router;
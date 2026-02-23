import express from "express";
import { registerUser, loginUser } from "../controllers/authcontrollers.js";
import protect from "../middlewares/authmiddlewares.js";
import authorizeRoles from "../middlewares/authorize.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json(req.user);
  }
);

export default router;
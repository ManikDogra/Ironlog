import express from "express";
import { signup, confirmSignup, resendConfirmation, login, logout, forgotPassword, confirmForgotPassword } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/confirm", confirmSignup);
router.post("/resend", resendConfirmation);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot", forgotPassword);
router.post("/confirm-reset", confirmForgotPassword);
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized!", user: req.user });
});

export default router;

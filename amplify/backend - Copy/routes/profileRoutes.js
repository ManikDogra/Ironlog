import express from "express";
import { getProfile, createProfile, updateProfile, recordLogin } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getProfile);
router.post("/", verifyToken, createProfile);
router.put("/", verifyToken, updateProfile);
router.post("/login", verifyToken, recordLogin);

export default router;

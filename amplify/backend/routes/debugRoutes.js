import express from "express";
import { me, findProfiles } from "../controllers/debugController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dev-only: return decoded token payload and profile for current user
router.get("/me", verifyToken, me);

// Dev-only: search profiles by query param 'sub' or list some profiles
router.get("/profiles", verifyToken, findProfiles);

export default router;

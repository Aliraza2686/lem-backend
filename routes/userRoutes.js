import express from "express";
import { getSingelUser, loginUser, logoutUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get('/get-user/:id', getSingelUser)

export default router;
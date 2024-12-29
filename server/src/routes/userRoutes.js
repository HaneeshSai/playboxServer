import express from "express";
import {
  authUser,
  createBooking,
  getUserProfile,
  handleExtraPlayerPayment,
  handlePayment,
  joinExistingTeam,
} from "../controllers/userController.js";

const router = express.Router();
router.post("/auth", authUser);
router.post("/createbooking", createBooking);
router.post("/payment", handlePayment);
router.post("/joinexistingteam", joinExistingTeam);
router.post("/handleextraplayerpayment", handleExtraPlayerPayment);
router.post("/getuserprofile", getUserProfile);

export default router;

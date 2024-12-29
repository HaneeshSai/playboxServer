import express from "express";
import {
  findBox,
  getBoxDetails,
  getBoxes,
  getLookingBookings,
  registerBox,
} from "../controllers/boxController.js";

const router = express.Router();

router.post("/registerbox", registerBox);
router.post("/getboxes", getBoxes);
router.post("/getbox", getBoxDetails);
router.post("/getlookingbookings", getLookingBookings);
router.post("/findbox", findBox);

export default router;

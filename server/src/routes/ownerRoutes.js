import express from "express";
import {
  getOwnerBox,
  updateCurrentStatus,
} from "../controllers/ownerController.js";

const router = express.Router();

router.post("/getownersbox", getOwnerBox);
router.post("/updatecurrentstatus", updateCurrentStatus);

export default router;

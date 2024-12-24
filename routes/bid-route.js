import express from "express";
import {
  createBid,
  getBidsForBeat,
  updateBidStatus,
  getBidsForUser,
} from "../controller/bid-controller.js";
import { authenticateUser } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/", authenticateUser, createBid);

router.get("/beat/:beatId", authenticateUser, getBidsForBeat);

router.patch("/:bidId", authenticateUser, updateBidStatus);

router.get("/", authenticateUser, getBidsForUser);

export default router;

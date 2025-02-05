import { createModificationRequest } from "../controller/modificationRequest-controller.js";
import { Router } from "express";
import { authenticateUser } from "../controller/auth-controller.js";
const router = Router();

router.post("/request", authenticateUser, createModificationRequest);

export default router;

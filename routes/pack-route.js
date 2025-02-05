import express from "express";

import { createPack, getAllPacks } from "../controller/pack-controller.js";
import { uploadPackFields } from "../utils/storage.js";
import { authenticateUser } from "../controller/auth-controller.js";
const router = express.Router();

router
  .get("/", getAllPacks)
  .post("/upload-packs", authenticateUser, uploadPackFields, createPack);

export default router;

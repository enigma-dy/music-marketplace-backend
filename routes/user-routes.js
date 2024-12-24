import express from "express";
import * as user from "../controller/user-controller.js";
import { authenticateUser } from "../controller/auth-controller.js";
import { uploadProfilePic } from "../utils/storage.js";

const route = express.Router();
route.get("/producers", user.getAllProducer);
route.get("/me", authenticateUser, user.getMe);
route.patch(
  "/me",
  authenticateUser,
  uploadProfilePic.single("profilePic"),
  user.updateMe
);
route.delete("/me", authenticateUser, user.deleteMe);

export default route;

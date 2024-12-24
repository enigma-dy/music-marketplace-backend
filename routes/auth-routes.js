import express from "express";
import * as auth from "../controller/auth-controller.js";
import { authenticateUser } from "../controller/auth-controller.js";
const route = express.Router();

route.get("/check-status", authenticateUser, (req, res) => {
  return res.status(200).json({ user: req.user });
});
route.post("/login", auth.login);
route.post("/register", auth.registerUser);

export default route;

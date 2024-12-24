import express from "express";
import { getUserNotifications } from "../controller/notification-controller.js";
import { authenticateUser } from "../controller/auth-controller.js";

const route = express.Router();
route.get("/", authenticateUser, getUserNotifications);
export default route;

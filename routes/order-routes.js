import * as beatOrder from "../controller/beat-order-controller.js";
import * as packsOrder from "../controller/pack-order-controller.js";
import { authenticateUser } from "../controller/auth-controller.js";
import express from "express";

const route = express.Router();

route.post("/beat", beatOrder.createOrder);
route
  .get("/orders", beatOrder.getOrdersByBuyer)
  .get("/:id", beatOrder.getOrderById);

route.post("/pack", authenticateUser, packsOrder.createOrder);
export default route;

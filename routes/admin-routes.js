import express from "express";
import * as admin from "../controller/admin-controller.js";
const route = express.Router();

route
  .get("/", admin.getAlladmin)
  .get("/:id", admin.getAdmin)
  .post("/", admin.createAdmin)
  .delete("/:id", admin.deleteAdmin);

export default route;

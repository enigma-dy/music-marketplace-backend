import express from "express";
import * as track from "../controller/track-controller.js";
import { authenticateUser } from "../controller/auth-controller.js";
import { authorizeProducer } from "../middleware/authorization.js";
import { uploadBeat } from "../utils/storage.js";

const routes = express.Router();

routes
  .get("/", track.getAllTracks)
  .get("/:id", track.getTrack)
  .get("/stream/:id", track.getStreamLink)
  .post(
    "/",
    authenticateUser,
    authorizeProducer("producer"),
    uploadBeat,
    track.createTrack
  )
  .patch("/:id", track.updateTrack)
  .delete("/:id", track.deleteTrack);

export default routes;

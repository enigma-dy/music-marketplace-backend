import express from "express";
import * as track from "../controller/track-controller.js";
import { authenticateUser } from "../controller/auth-controller.js";
import { authorizeProducer } from "../middleware/authorization.js";
import { uploadBeat } from "../utils/storage.js";

const routes = express.Router();

routes
  .get("/", track.getAllTracks)
  .get("/stream/:id", track.streamTrack)
  .get("/:id", track.getTrack)
  .post(
    "/",
    authenticateUser,
    authorizeProducer("artist"),
    uploadBeat,
    track.createTrack
  )
  .patch("/:id", track.updateTrack)
  .delete("/:id", track.deleteTrack);

export default routes;

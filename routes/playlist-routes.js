import express from "express";
import * as playlist from "../controller/playlist-controller.js";
import { uploadPlaylistCover } from "../utils/storage.js";
import { authenticateUser } from "../controller/auth-controller.js";

const route = express.Router();

route.get("/", playlist.getAllPlaylists);
route.get("/:id", playlist.getPlaylist);
route.patch(
  "/:id",
  uploadPlaylistCover.single("file"),
  uploadPlaylistCover.single("playlist-cover"),
  playlist.updatePlaylist
);
route.post(
  "/",
  authenticateUser,
  uploadPlaylistCover.single("file"),
  playlist.createPlaylist
);
route.delete("/:id", playlist.deletePlaylist);

export default route;

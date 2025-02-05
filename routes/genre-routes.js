import express from "express";
import * as genre from "../controller/genre-controller.js";

const router = express.Router();

router.get("/", genre.getAllGenres);
router.get("/songs", genre.getGenresWithSongs)
router.post("/", genre.createGenre);
router.get("/:genreId", genre.getTracksByGenre);
router.patch("/:genreId", genre.updateGenre);
router.delete("/:genreId", genre.deleteGenre);

export default router;

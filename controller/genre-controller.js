import Genre from "../models/genre-model.js";
import Beat from "../models/beat-model.js";
import { buildQueryPipeline } from "../utils/queryFilter.js";

export const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    return res.status(200).json({
      status: "successful",
      message: "Genres fetched successfully",
      genres,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getGenresWithSongs = async (req, res) => {
  try {
   
    const genrePipeline = buildQueryPipeline(req.query);
    const genres = await Genre.aggregate(genrePipeline);

    const genreSongs = await Promise.all(
      genres.map(async (genre) => {
        
        const songPipeline = buildQueryPipeline({
          ...req.query,
          genre: genre._id,
        });

        const songs = await Beat.aggregate(songPipeline).lookup({
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        });

        return {
          genre: genre.name,
          songs: songs.map((song) => ({
            title: song.title,
            coverImage: song.coverImagePath,
            owner: song.createdBy[0]?.username || "Unknown",
          })),
        };
      })
    );

    res.status(200).json({
      status: "successful",
      message: "Genres and songs fetched successfully",
      data: genreSongs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while fetching genres and songs",
    });
  }
};

export const createGenre = async (req, res) => {
  try {
    const { name } = req.body;

    const existingGenre = await Genre.findOne({ name: name });
    if (existingGenre) {
      return res
        .status(400)
        .json({ status: "failed", message: "Genre already exists" });
    }
    const genre = await Genre.create({ name });
    return res.status(201).json({
      status: "successful",
      message: "Genre created successfully",
      genre,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getTracksByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const tracks = await Beat.find({ genre: genreId }).populate("genre");
    if (!tracks) {
      return res
        .status(404)
        .json({ status: "failed", message: "No tracks found for this genre" });
    }
    return res.status(200).json({
      status: "successful",
      message: "Tracks fetched successfully",
      tracks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const deleteGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    await Genre.deleteOne({ _id: genreId });

    return res.status(200).json({
      status: "successful",
      message: "Genre deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const updateGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const { name } = req.body;
    const genre = await Genre.findByIdAndUpdate(
      genreId,
      { name },
      { new: true }
    );
    if (!genre) {
      return res
        .status(404)
        .json({ status: "failed", message: "Genre not found" });
    }
    return res.status(200).json({
      status: "successful",
      message: "Genre updated successfully",
      genre,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

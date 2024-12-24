import Beat from "../models/beat-model.js";
import Genre from "../models/genre-model.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

export const createTrack = async (req, res) => {
  try {
    const {
      title,
      artist,
      genre,
      description,
      price,
      previewUrl,
      tags,
      license,
    } = req.body;

    const filePath = req.files["file"] ? req.files["file"][0].path : null;
    const coverPath = req.files["cover"] ? req.files["cover"][0].path : null;

    const genreDoc = await Genre.findById(genre);
    if (!genreDoc) {
      return res.status(400).json({
        status: "failed",
        message: "Genre not found",
      });
    }

    if (!title || !artist || !genre || !price || !filePath) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide all required fields",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Price must be a positive number",
      });
    }

    const track = await Beat.create({
      title,
      artist,
      genre: genre,
      description,
      price,
      filePath,
      previewUrl,
      tags,
      license,
      coverPath,
    });

    return res.status(200).json({
      status: "successful",
      message: "Track created successfully",
      track,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server error" });
  }
};

export const getAllTracks = async (req, res) => {
  try {
    const track = await Beat.find({}).populate("genre");

    return res
      .status(200)
      .json({ status: "sucessful", message: "this is a the tracks", track });
  } catch (error) {
    console.error(error),
      res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const streamTrack = async (req, res) => {
  try {
    const { id } = req.params;

    // Correct the query to find by ID
    const track = await Beat.findById(id);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    const filePath = track.filePath;
    if (!filePath) {
      return res.status(404).json({ message: "File path is missing" });
    }

    const normalizedFilePath = path.normalize(filePath);
    console.log("Normalized File Path:", normalizedFilePath);

    // if (!fs.existsSync(normalizedFilePath)) {
    //   return res.status(404).json({ message: "Audio file not found" });
    // }

    const stat = fs.statSync(normalizedFilePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const file = fs.createReadStream(normalizedFilePath, { start, end });
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/mpeg",
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
      });
      fs.createReadStream(normalizedFilePath).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTrack = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid track ID" });
    }
    const track = await Beat.findById({ _id: id });

    if (!track) {
      return res
        .status(404)
        .json({ status: "failed", message: "Track not found" });
    }

    return res
      .status(200)
      .json({ status: "sucessful", message: "this is a the tracks", track });
  } catch (error) {
    console.error(error),
      res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const updateTrack = async (req, res) => {
  try {
    const body = req.body;
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid track ID" });
    }

    const track = await Beat.findById(id);

    if (!track) {
      return res.status(404).json({
        status: "failed",
        message: "Track not found",
      });
    }

    const result = await Beat.updateOne(
      { _id: id },
      {
        $set: {
          ...body,
          lastUpdated: new Date(),
        },
      },
      { runValidators: true }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Track not found",
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({
        status: "successful",
        message: "No changes were made",
      });
    }

    return res
      .status(200)
      .json({ status: "successful", message: "Track updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid track ID" });
    }
    const track = await Beat.findfindByIdAndDelete({ _id: id });

    if (!track) {
      return res
        .status(404)
        .json({ status: "failed", message: "Track not found" });
    }

    return res
      .status(200)
      .json({ status: "sucessful", message: "this is a the tracks", track });
  } catch (error) {
    console.error(error),
      res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

import Beat from "../models/beat-model.js";
import Genre from "../models/genre-model.js";
import mongoose from "mongoose";
import { buildQueryPipeline } from "../utils/queryFilter.js";
import path from "path";
import fs from "fs";

const __dirname = new URL(".", import.meta.url).pathname;

export const createTrack = async (req, res) => {
  try {
    const { title, genre, description, price, previewUrl, tags, license } =
      req.body;

    const createdBy = req.user.id;

    const file = req.files["file"] ? req.files["file"][0] : null;
    const coverImage = req.files["coverImage"]
      ? req.files["coverImage"][0]
      : null;

    if (!title)
      return res
        .status(400)
        .json({ status: "failed", message: "Title is required" });
    if (!genre)
      return res
        .status(400)
        .json({ status: "failed", message: "Genre is required" });
    if (!price)
      return res
        .status(400)
        .json({ status: "failed", message: "Price is required" });
    if (!file)
      return res
        .status(400)
        .json({ status: "failed", message: "File upload is required" });
    if (!coverImage)
      return res
        .status(400)
        .json({ status: "failed", message: "Cover image upload is required" });

    if (!title || !createdBy || !genre || !price || !file || !coverImage) {
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
    let genreDoc;
    if (mongoose.Types.ObjectId.isValid(genre)) {
      genreDoc = await Genre.findById(genre);
    } else {
      genreDoc = await Genre.findOne({ name: genre });
    }

    if (!genreDoc) {
      return res.status(400).json({
        status: "failed",
        message: "Genre not found",
      });
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const filePath = `${baseUrl}/uploads/beats/${file.filename}`;
    const coverImagePath = `${baseUrl}/uploads/beats/${coverImage.filename}`;

    const track = await Beat.create({
      title,
      createdBy,
      genre: genreDoc._id,
      description,
      price,
      filePath,
      coverImagePath,
      previewUrl,
      tags,
      license,
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
    const pipeline = buildQueryPipeline(req.query);

    pipeline.push({
      $lookup: {
        from: "genres",
        localField: "genre",
        foreignField: "_id",
        as: "genre",
      },
    });

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$createdBy",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $unwind: {
        path: "$genre",
        preserveNullAndEmptyArrays: true,
      },
    });
    pipeline.push({
      $project: {
        filePath: 0,
      },
    });
    const track = await Beat.aggregate(pipeline);

    return res.status(200).json({
      status: "successful",
      message: "Tracks fetched successfully",
      resultCount: track.length,
      track,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getStreamLink = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await Beat.findById(id);

    if (!track) {
      return res
        .status(404)
        .json({ status: "failed", message: "Track not found" });
    }

    console.log(track);

    const relativeFilePath = track.filePath
      .replace("http://localhost:5000", "")
      .replace(/^\/+/, "");

    console.log(relativeFilePath);

    const projectRoot = path.resolve(__dirname, "..");
    console.log(projectRoot);
    const localFilePath = path.resolve(projectRoot, relativeFilePath).slice(3);
    console.log(localFilePath);

    if (!fs.existsSync(localFilePath)) {
      return res
        .status(404)
        .json({ status: "failed", message: "File not found" });
    }

    const stat = fs.statSync(localFilePath);
    const readStream = fs.createReadStream(localFilePath);

    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "audio/mpeg");
    readStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server error" });
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

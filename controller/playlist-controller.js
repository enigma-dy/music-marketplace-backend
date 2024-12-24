import Playlist from "../models/playlist-model.js";
import mongoose from "mongoose";

export const createPlaylist = async (req, res) => {
  try {
    const { title, beats } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        status: "failed",
        message: "Playlist title is required",
      });
    }

    const newPlaylist = new Playlist({
      title,
      user: userId,
      beats: beats || [],
    });

    await newPlaylist.save();

    res.status(201).json({
      status: "successful",
      message: "Playlist created successfully",
      playlist: newPlaylist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("beats");

    res.status(200).json({
      status: "successful",
      message: "Playlists retrieved successfully",
      playlists,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getPlaylistsCreatedByUser = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).populate(
      "beats"
    );

    res.status(200).json({
      status: "successful",
      message: "Playlists retrieved successfully",
      playlists,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};
export const getPlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid playlist ID",
      });
    }

    const playlist = await Playlist.findOne({
      _id: id,
      user: req.user.id,
    }).populate("beats");

    if (!playlist) {
      return res.status(404).json({
        status: "failed",
        message: "Playlist not found or unauthorized",
      });
    }

    res.status(200).json({
      status: "successful",
      message: "Playlist retrieved successfully",
      playlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid playlist ID",
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "No updates provided",
      });
    }

    const result = await Playlist.updateOne(
      { _id: id, user: req.user.id },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Playlist not found or unauthorized",
      });
    }

    res.status(200).json({
      status: "successful",
      message: "Playlist updated successfully",
      updates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid playlist ID",
      });
    }

    const playlist = await Playlist.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!playlist) {
      return res.status(404).json({
        status: "failed",
        message: "Playlist not found or unauthorized",
      });
    }

    res.status(200).json({
      status: "successful",
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

import Pack from "../models/pack-model.js";

export const createPack = async (req, res) => {
  try {
    const { title, description, price, discount, tags, license, contents } =
      req.body;
    const creator = req.user.id;

    if (!title || !price || !req.files["file"]) {
      return res
        .status(400)
        .json({ status: "failed", message: "Required fields are missing" });
    }

    let parsedContents;
    try {
      parsedContents =
        typeof contents === "string" ? JSON.parse(contents) : contents;
    } catch (error) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid JSON format for contents",
      });
    }

    const file = req.files["file"][0];
    const cover = req.files["pack-cover"] ? req.files["pack-cover"][0] : null;

    const baseUrl =
      process.env.BASE_URL || "https://music-marketplace-backend.onrender.com";
    const fileUrl = `${baseUrl}/uploads/beats/${file.filename}`;
    const coverUrl = cover
      ? `${baseUrl}/uploads/beats/${cover.filename}`
      : null;

    const newPack = await Pack.create({
      title,
      description,
      creator,
      fileUrl,
      coverImage: coverUrl,
      price,
      discount,
      tags,
      license,
      contents: parsedContents,
    });

    res.status(201).json({
      status: "successful",
      message: "Pack created successfully",
      pack: newPack,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getAllPacks = async (req, res) => {
  try {
    const { creator, tags, license, status } = req.query;

    const query = {};
    if (creator) query.creator = creator;
    if (tags) query.tags = { $in: tags.split(",") };
    if (license) query.license = license;
    if (status) query.status = status;

    const packs = await Pack.find(query);

    res.status(200).json({
      status: "successful",
      message: "Packs retrieved successfully",
      packs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const getPackById = async (req, res) => {
  try {
    const { id } = req.params;

    const pack = await Pack.findById(id).populate("creator");

    if (!pack) {
      return res.status(404).json({
        status: "failed",
        message: "Pack not found",
      });
    }

    res.status(200).json({
      status: "successful",
      message: "Pack retrieved successfully",
      pack,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const updatePack = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      // Fetch and delete the old file only if a new file is uploaded
      const oldPack = await Pack.findById(id);
      if (oldPack?.fileUrl) {
        await deleteFile(oldPack.fileUrl);
      }
      updates.fileUrl = req.file.path; // Save the new file path
    }

    // Perform the update
    const updatedPack = await Pack.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPack) {
      return res.status(404).json({
        status: "failed",
        message: "Pack not found",
      });
    }

    res.status(200).json({
      status: "successful",
      message: "Pack updated successfully",
      pack: updatedPack,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const deletePack = async (req, res) => {
  try {
    const { id } = req.params;

    const pack = await Pack.findByIdAndDelete(id);

    if (!pack) {
      return res.status(404).json({
        status: "failed",
        message: "Pack not found",
      });
    }

    await deleteFile(pack.fileUrl);

    res.status(200).json({
      status: "successful",
      message: "Pack deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

export const downloadPack = async (req, res) => {
  try {
    const { id } = req.params;

    const pack = await Pack.findById(id);

    if (!pack) {
      return res.status(404).json({
        status: "failed",
        message: "Pack not found",
      });
    }

    pack.downloadCount += 1;
    await pack.save();

    res.redirect(pack.fileUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

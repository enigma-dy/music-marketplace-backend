import Pack from "../models/pack-model.js";

export const createPack = async (req, res) => {
  try {
    const { title, description, price, discount, tags, license, contents } =
      req.body;
    const creator = req.user.id;

    const fileUrl = req.files["file"][0].path;

    const coverUrl = req.files["pack-cover"]
      ? req.files["pack-cover"][0].path
      : null;

    if (!req.files) {
      return res.status(400).json({
        status: "failed",
        message: "A compressed file is required to create a pack",
      });
    }

    const newPack = await Pack.create({
      title,
      description,
      creator,
      fileUrl,
      coverUrl,
      price,
      discount,
      tags,
      license,
      contents,
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

import Beat from "../models/beat-model";
import Genre from "../models/genre-model";

const genreMiddleware = async (req, res) => {
  try {
    const { genreId } = req.params;
    const tracks = await Beat.findById({ genre: genreId });
    if (tracks.length > 0) {
      const defaultGenre = await Genre.findOne({ name: "Uncategorized" });

      if (!defaultGenre) {
        const defaultGenre = await Genre.create({ name: "Uncategorized" });
      }
      await Beat.updateMany({ genre: genreId }, { genre: defaultGenre._id });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

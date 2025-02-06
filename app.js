import express from "express";
import connectDB from "./config/db.js";
import track from "./routes/track-routes.js";
import genre from "./routes/genre-routes.js";
import playlist from "./routes/playlist-routes.js";
import user from "./routes/user-routes.js";
import order from "./routes/order-routes.js";
import authenticate from "./routes/auth-routes.js";
import Modification from "./routes/modification-route.js";
import packs from "./routes/pack-route.js";
import Notification from "./routes/notification-route.js";
import { fileURLToPath } from "url";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

connectDB();

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/tracks", track);
app.use("/api/twerk", Modification);
app.use("/api/notification", Notification);
app.use("/api/genre", genre);
app.use("/api/playlist", playlist);
app.use("/api/packs", packs);
app.use("/api/auth", authenticate);
app.use("/api/user", user);
app.use("/api/order", order);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

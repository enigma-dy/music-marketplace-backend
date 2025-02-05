import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const createUpload = (folderName) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../uploads/${folderName}`);
      ensureDirectoryExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
};

const uploadBeat = multer({ storage: createUpload("beats") }).fields([
  { name: "file", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
const uploadPackFields = multer({ storage: createUpload("packs") }).fields([
  { name: "file", maxCount: 1 },
  { name: "pack-cover", maxCount: 1 },
]);

const uploadProfilePic = multer({ storage: createUpload("profilePics") });
const uploadPlaylistCover = multer({ storage: createUpload("playlistCovers") });

export { uploadBeat, uploadPackFields, uploadProfilePic, uploadPlaylistCover };

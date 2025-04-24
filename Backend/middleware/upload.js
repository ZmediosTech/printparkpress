// middleware/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Folder to store uploads
const uploadPath = 'uploads';

// ✅ Ensure upload folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

export default upload;
